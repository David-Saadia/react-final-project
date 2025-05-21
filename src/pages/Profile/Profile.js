import { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';

//Context and tools
import {auth} from "../../firebase/FireBase";
import { userContext } from "../../UserProvider";
import {searchDB} from "../../firebase/ReadWriteDB";
import axios from "../../axiosInstance";

// Components
import NavigationBar from "../../components/base-components/NavigationBar/NavigationBar";
import CardTable from "../../components/CardTable/CardTable";
import BackgroundWrapper from "../../components/base-components/BackgroundWrapper";

import bg from "../../assets/images/scrollableBackground.png";

export default function Profile() {
    
    const [actors , setActors] = useState([]);
    const {user} = useContext(userContext);
    const navigation = useNavigate();

    useEffect(() =>{
            // Change this function to fetch the user's settings from the database
            const fetchActors = async () => {
                const refernceURL = `/users/${auth.currentUser?.uid}/actors`;
                const results = await searchDB(refernceURL);
                console.log("The results are", results);
                setActors(results);
            }
            fetchActors();

            //Add a function to fetch the user's posts from the backend
            
    } , []);

    useEffect(() => {
        if (!user) {
            navigation("/");
        }
    }, [user, navigation]);


    return (
        <BackgroundWrapper
            title="Profile Page"
            backgroundImage= {bg}
            backgroundRepeat= "repeat-y"
            backgroundAttachment= "scroll"
        >

            <div className ="profile">
                <NavigationBar currentPage="profile"/>
                <div className="page-container">
                    <section id="user-actors">
                        <CardTable  tableTitle= "Your added Actors" styleClass="card-table" rows={actors}/>
                    </section>

                </div>
            </div>
        </BackgroundWrapper>
    )
}