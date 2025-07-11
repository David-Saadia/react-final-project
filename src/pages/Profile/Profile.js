import { useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';

//Context and tools
import { userContext } from "../../UserProvider";


// Components
import NavigationBar from "../../components/base-components/NavigationBar/NavigationBar";
//import CardTable from "../../components/CardTable/CardTable";
import BackgroundWrapper from "../../components/base-components/BackgroundWrapper";

import bg from "../../assets/images/scrollableBackground.png";
import SideMenu from "../../components/SideMenu/SideMenu";
import PostFeed from "../../components/PostFeed/PostFeed";

export default function Profile() {
    
    const {user} = useContext(userContext);
    const navigation = useNavigate();

    useEffect(() =>{
            // Change this function to fetch the user's settings from the database
            // const fetchActors = async () => {
            //     const refernceURL = `/users/${auth.currentUser?.uid}/actors`;
            //     const results = await searchDB(refernceURL);
            //     console.log("The results are", results);
            //     setActors(results);
            // }
            // fetchActors();
            
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
                <NavigationBar/>
                <div className="page-container">
                    <SideMenu/>
                    <PostFeed type="profile"/>

                </div>
            </div>
        </BackgroundWrapper>
    )
}