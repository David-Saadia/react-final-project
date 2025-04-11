import { useState, useEffect } from "react";
import {ref, get} from "firebase/database";	

import NavigationBar from "../base-components/NavigationBar/NavigationBar";
import database from "../FireBase";
import {auth} from "../FireBase";
import CardTable from "../CardTable/CardTable";

export default function Profile() {
    
    const [actors , setActors] = useState([]);

    useEffect(() =>{
            const fetchActors = async () => {
                const refernceURL = `/users/${auth.currentUser.uid}/actors`;
                const dbRef = ref(database, refernceURL);

                try{
                    const snapshot = await get(dbRef);
                    if(snapshot.exists()){
                        console.log(`Data recieved from firebase ${snapshot.val()}`);
                        setActors(snapshot.val());
                    }
                    else{
                        console.log("No data available on database.");
                    }
                }

                catch (error){
                    console.error("Error fetching data from database: ", error);
                }
                
            }
            fetchActors();
    } , []);


    return (
        <div className ="profile">
            <NavigationBar/>
            <div className="page-container">
                <section id="user-actors">
                    <CardTable  tableTitle= "Your added Actors" styleClass="card-table" rows={actors}/>
                </section>


            </div>

        </div>
    )
}