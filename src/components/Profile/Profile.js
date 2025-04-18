import { useState, useEffect } from "react";
// import {ref, get} from "firebase/database";	
// import database from "../FireBase";

import NavigationBar from "../base-components/NavigationBar/NavigationBar";
import {auth} from "../FireBase";
import CardTable from "../CardTable/CardTable";
import {searchDB} from "../SearchDB";
import bg from "../../assets/images/scrollableBackground.png";

export default function Profile() {
    
    const [actors , setActors] = useState([]);

    useEffect(() =>{
            const fetchActors = async () => {
                const refernceURL = `/users/${auth.currentUser?.uid}/actors`;
                const results = await searchDB(refernceURL);
                console.log("The results are", results);
                setActors(results);
            }
            fetchActors();


             document.title = "Profile Page";
                    document.body.style.backgroundImage = `url(${bg})`; ;
                    
                    document.body.style.backgroundPosition = "top center";
                    document.body.style.backgroundSize = "cover"; // This fills the entire screen
                    document.body.style.backgroundRepeat = "repeat-y";
                    document.body.style.backgroundAttachment = "scroll";
                    document.body.style.margin= "0";
                    document.body.style.padding= "0";
            
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