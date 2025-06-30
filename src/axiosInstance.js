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
            const token = await getIdToken(user, true); //Make sure token is fresh
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;