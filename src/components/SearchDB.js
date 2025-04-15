
import {ref, query, orderByChild, limitToFirst, equalTo, get} from "firebase/database";

import database from "./FireBase";


/**
 * Searches the Firebase database at the specified path, optionally filtering
 * by a specified field and value, and limiting the number of results.
 * 
 * @param {string} path - The database path to search.
 * @param {string|null} field - The child key to order the results by (optional).
 * @param {*} value - The value to match the ordered child key against (optional).
 * @param {number} limit - The maximum number of results to return. Default is 1.
 * @returns {Promise<Object|null>} - A promise that resolves to the data retrieved
 *                                   from the database if it exists, or null if no
 *                                   data is found or an error occurs.
 */

export const searchDB = async (path, field = null, value = null , limit = 1) =>{
    
    let queryRef = ref(database, path);
    if (field && value) {
        queryRef = query(
            queryRef, 
            orderByChild(field), 
            equalTo(value), 
            limitToFirst(limit)); 
    }

    try{
        const snapshot = await get(queryRef);
        if(snapshot.exists()){
            console.log("Data recieved from firebase: ", snapshot.val());
            const data = snapshot.val();
            return data;
        }
          
        else{ console.log("No data available on database."); }
    }catch(error){
        console.error("Error fetching data from database: ", error);
    }

    return null;
}