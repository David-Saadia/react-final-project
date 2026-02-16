import axios from "axios";

import { getIdToken } from "firebase/auth";
import { auth } from "./firebase/FireBase";

//Base server URL - add exact database route through exported function
const axiosInstance = axios.create({
    baseURL: "http://localhost:64209/api",
});

/**
 * This file ensures that upon any request to the server,
 * the token of the user if they're signed in is added to the request headers.
 * This ensures that the server has access to the user's data and can verify their identity
 * so they can preform actions on the database.
 *  
 * If we don't do this, anybody will be able to send requests to the server and preform actions 
 * rather they're authenticated users or not.
 */

axiosInstance.interceptors.request.use(
    //Use this middleware promise to add token to requests
    async (config) => {
        const user = auth.currentUser;
        if (user) {
            const token = await getIdToken(user, false);
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const cache = new Map();
const pendingRequests = new Map(); // Map to store pending requests
//       minutes * seconds * milliseconds, Time to live
const CACHE_TTL = 10 * 60 * 1000; 

const CACHE_BLACKLIST = [
    // Exclude getMessages (/chats/:chatId) but allow /chats/ (list) or /chats/:id/search
    /\/chats\/[^/?]+(\?.*)?$/
];

/**
 * Returns a cache key based on the user, request method, full URL including params, and response type.
 * If the user is not signed in, returns null.
 * @param {Object} config - The axios request config object.
 * @returns {string|null} - The cache key or null if the user is not signed in.
 */
const getCacheKey = (config) => {
    const user = auth.currentUser;
    if (!user) return null;
    
    //Use getUri (full URL + params) to handle baseURL and params serialization consistently
    const url = axiosInstance.getUri(config);

    // Check if URL matches any blacklist pattern
    if (CACHE_BLACKLIST.some(regex => regex.test(url))) {
        return null;
    }

    const method = config.method ? config.method.toLowerCase() : 'get';
    const responseType = config.responseType || '';

    return `${user.uid}:${method}:${url}:${responseType}`;
};

//Request interceptor for caching
axiosInstance.interceptors.request.use(
    (config) => {
        if (config.method && config.method.toLowerCase() === 'get'){
            const key = getCacheKey(config);
            if (key){
                const cached = cache.get(key);
                if (cached && (Date.now() - cached.timestamp < CACHE_TTL)){
                    //DEBUG: console.log(`[Cache] Hit: ${key}`);
                    const error = new Error("Cached response");
                    error.cachedResponse = cached.response;
                    error.isCached = true;
                    throw error;
                }
                
                //Check for in-flight requests (Deduplication)
                //If a request for this key is already pending, we don't want to send another one.
                if (pendingRequests.has(key)) {
                    //DEBUG: console.log(`[Cache] Deduplicating request: ${key}`);
                    const error = new Error("Request already in flight");
                    error.isInFlight = true;
                    error.promise = new Promise((resolve, reject) => {
                        pendingRequests.get(key).push({ resolve, reject });
                    });
                    throw error;
                }

                //Mark request as in-flight
                //Initialize the list of waiters for this key.
                pendingRequests.set(key, []);
                //DEBUG: console.log(`[Cache] Miss: ${key}`);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

//Response interceptor for caching
axiosInstance.interceptors.response.use(
    (response) => {
        if (response.config.method && response.config.method.toLowerCase() === 'get' && response.status === 200) {
            const key = getCacheKey(response.config);
            if (key) {
                //Resolve any pending requests waiting for this data
                if (pendingRequests.has(key)) {
                    const waiters = pendingRequests.get(key);
                    //Notify all waiting promises with the fresh response
                    waiters.forEach(({ resolve }) => resolve(response));
                    pendingRequests.delete(key);
                }

                //Save to in-memory cache
                //DEBUG: console.log(`[Cache] Set: ${key}`);
                cache.set(key, { response, timestamp: Date.now() });
            }
        }
        return response;
    },
    (error) => {
        //Case 1: It was a cache hit (from request interceptor)
        if (error.isCached && error.cachedResponse) {
           //DEBUG: console.log("[Cache] Using cached response for request:", error.cachedResponse.config.url);
            return Promise.resolve(error.cachedResponse);
        }

        //Case 2: It was a deduplicated request (waiting for in-flight)
        if (error.isInFlight && error.promise) {
            return error.promise;
        }

        //Case 3: Actual network error
        //If the request failed, we must notify any waiters so they don't hang forever.
        if (error.config && error.config.method && error.config.method.toLowerCase() === 'get') {
             const key = getCacheKey(error.config);
             if (key && pendingRequests.has(key)) {
                 const waiters = pendingRequests.get(key);
                 waiters.forEach(({ reject }) => reject(error));
                 pendingRequests.delete(key);
             }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;