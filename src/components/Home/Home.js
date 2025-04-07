import {useEffect, useState} from "react";	

import { splitAndCapitalizeEmail } from "../utils";
import CardForm from "../CardForm/CardForm";
import CardTable from "../CardTable/CardTable";
import ScreenTitle from "../base-components/ScreenTitle/ScreenTitle";
import "../utils.css";
import "./Home.css";
import bg from "../../assets/images/scrollableBackground.png";

export default function Home(props) {

    const [dummyUsers, setDummyUsers] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => { 
        const fetchUsers = async () => {
            try {
                const totalPages = 2;
                const fetches =[];
                for (let i = 1; i <= totalPages; i++) {
                    const path = `https://reqres.in/api/users?page=${i}`;
                    fetches.push(fetch(path).then(response => response.json()));
                    console.log(path);
                }
                const data = await Promise.all(fetches);
                setDummyUsers(data.flatMap(page =>
                    page.data.map(user=> ({
                        name: `${user.first_name} ${user.last_name}`,
                        avatar: user.avatar
                    }))
                ));
                console.log("Users added....!!!");
                setLoading(false);

            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }

        fetchUsers();
        //Setting page general attributes
        document.title = "Home Page";
        document.body.style.backgroundImage = `url(${bg})`; ;
        document.body.style.backgroundSize= "100% auto";
        document.body.style.backgroundPosition = "top center";
        document.body.style.backgroundRepeat = "repeat-y";
        document.body.style.backgroundAttachment = "scroll";
        document.body.style.margin= "0";
        document.body.style.padding= "0";

    }, []);
    

    if(loading) return <div>Loading...</div>;


    return (
        <div class="home">
            <div class="docked-container welcome-docker">
                <ScreenTitle design_id="welcome-title" title={`Welcome ${splitAndCapitalizeEmail(props.user.email)}`}/>
                <button class="log-out-button" onClick={props.signOut} aria-label="Sign Out"></button>
            </div>
            <div class="page-container">
                <CardForm styleClass="card-form" addRow={(name, avatar) =>{
                    const newRow = { name: name, avatar: avatar };
                    setDummyUsers(prev => [...prev, newRow]);
                    } }/>
                <CardTable styleClass="card-table" rows={dummyUsers}/> 
            </div>
        </div>
    );
}