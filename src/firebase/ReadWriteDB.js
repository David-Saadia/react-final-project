
import {ref, query, orderByChild, limitToFirst, equalTo, get, set} from "firebase/database";

import database from "./FireBase";


/**
 * Searches the Firebase database at the specified path, optionally filtering
 * by a specified field and value, and limiting the number of results.
 * 
 * @param {string} path - The database path to search.
 * @param {string|null} field - The child key to order the results by (optional). i.e. "user/name"
 * @param {*} value - The value to match the ordered child key against (optional).
 * @param {number} limit - The maximum number of results to return. Default is 1.
 * @returns {Promise<Object|null>} - A promise that resolves to the data retrieved
 *                                   from the database if it exists, or null if no
 *                                   data is found or an error occurs.
 */

export const searchDB = async (path, field = null, value = null , limit = 1) =>{
    
    // Create a reference to the database at the specified path i.e. "database/users"
    console.log("The path is" , path);
    let queryRef = ref(database, path); 
    if (field && value) { 
        // If field and value are provided, we use them to speed up the search by ordering the query by the field,
        // and matching the value. Otherwise, we bring the entire list of values.
        console.log("Received a field. The field is: " , field);
        queryRef = query(
            queryRef, 
            orderByChild(field), // This will order the results by the specified field to speed up the search
            equalTo(value), // This will filter the results by the specified value
            limitToFirst(limit)); 
        }
        
    // Get the data from the database
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

export const writeToDB = async (path, data) => { 
    
    // Create a reference to the database at the specified path i.e. "database/users/$uid/presence"
    console.log("The path is: " , path, "\nThe data is: " , data);
    const queryRef = ref(database, path); 
    try{   
        await set(queryRef, data); 
        console.log("Data written to database successfully."); 
    }catch(error){ 
        console.error("Error writing data to database: ", error); 
    }
}

export const writeToListDB = async (path, data) => {

    // Create a reference to the database at the specified path i.e. "database/users/$uid/friends"
    // The data could be something like "/friends/$uid"
    console.log("The path is: " , path, "\nThe data is: " , data);
    const queryRef = ref(database, path); 
    try{
        //Check if list exists, if not, create it
        const snapshot = await get(queryRef); 
        if(!snapshot.exists()){
            await set(queryRef, [data]);
            console.log("List created with data item succesfully."); 
            return;
        }
        const list = snapshot.val();
        console.log("List is: " , list);
        await set(queryRef, [...list, data]);
        console.log("Data written to database list successfully."); 
    }catch(error){ 
        console.error("Error writing data to database: ", error); 
    }
}

export const removeFromListDB = async (path, data) => {
    // Create a reference to the database at the specified path i.e. "database/presence/"
    // The data could be something like "/presence/$uid"
    console.log("The path is: " , path, "\nThe data is: " , data);
    const queryRef = ref(database, path); 
    try{
        const snapshot = await get(queryRef);
        if (!snapshot.exists()){
            console.log("List does not exist, hence nothing to remove from.");
            return;
        }
        const list = snapshot.val();
        console.log("List is: " , list);
        const filteredList = list.filter(item => item !== data);
        await set(queryRef, filteredList);
        console.log("Data removed from list on database successfully.");
    }catch(error){ 
        console.error("Error removing data from database: ", error); 
    }
}