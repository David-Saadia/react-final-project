import {useEffect, useState} from "react";	


import CardForm from "../CardForm/CardForm";
import CardTable from "../CardTable/CardTable";

import "../utils.css";
import "./Home.css";
import bg from "../../assets/images/scrollableBackground.png";
import NavigationBar from "../base-components/NavigationBar/NavigationBar";

/**
 * A component that renders the main page of the application. The page is
 * divided into two sections. The top section contains a CardForm component
 * that allows the user to add a new row to the table. The bottom section
 * contains a CardTable component that displays the table with the rows that
 * the user has entered. The component uses the useState hook to store the
 * data in the table and the useEffect hook to fetch the data when the
 * component is mounted. The data is fetched from the reqres.in API. The
 * component also sets the page title and the background image of the page
 * when it is mounted.
 * 
 * @returns A JSX element representing the Home component.
 */
export default function Home() {

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
                console.log("Actors added....!!!");
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
        
        document.body.style.backgroundPosition = "top center";
        document.body.style.backgroundSize = "cover"; // This fills the entire screen
        document.body.style.backgroundRepeat = "repeat-y";
        document.body.style.backgroundAttachment = "scroll";
        document.body.style.margin= "0";
        document.body.style.padding= "0";

    }, []);
    
    console.log(dummyUsers);
    if(loading) return <div>Loading...</div>;


    return (
        <div className="home">
            <NavigationBar currentPage="home"/>
            <div className="page-container">
                <CardForm styleClass="card-form" addRow={(name, avatar) =>{
                    const newRow = { name: name, avatar: avatar };
                    setDummyUsers(prev => [...prev, newRow]);
                    } }/>
                <CardTable tableTitle= "Our Team" styleClass="card-table" rows={dummyUsers}/> 
            </div>
        </div>
    );
}