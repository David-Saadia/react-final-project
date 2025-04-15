import { useState, useEffect } from "react";
// import {ref, get} from "firebase/database";	
// import database from "../FireBase";

import NavigationBar from "../base-components/NavigationBar/NavigationBar";
import {auth} from "../FireBase";
import CardTable from "../CardTable/CardTable";
import {searchDB} from "../SearchDB";

export default function Profile() {
    
    const [actors , setActors] = useState([]);

    useEffect(() =>{
            const fetchActors = async () => {
                const refernceURL = `/users/${auth.currentUser.uid}/actors`;
                const results = await searchDB(refernceURL);
                console.log("The results are", results);
                setActors(results);
            }
            fetchActors();
    } , []);


    return (
        <div className ="profile">
            <NavigationBar currentPage="profile"/>
            <div className="page-container">
                <section id="user-actors">
                    <CardTable  tableTitle= "Your added Actors" styleClass="card-table" rows={actors}/>
                </section>


            </div>

        </div>
    )
}