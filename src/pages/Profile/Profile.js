import { useParams } from "react-router-dom";

//Context and tools

import { useRequireAuth } from "../../hooks/useRequireAuth";


// Components
import NavigationBar from "../../components/base-components/NavigationBar/NavigationBar";
import BackgroundWrapper from "../../components/base-components/BackgroundWrapper";
import SideMenu from "../../components/SideMenu/SideMenu";
import PostFeed from "../../components/PostFeed/PostFeed";
import bg from "../../assets/images/background-postfeed-light.png";
import Chat from "../Chat/Chat";

import "./Profile.css";

export default function Profile() {
    const {uid} = useParams();
    useRequireAuth();

    return (
        <BackgroundWrapper
            title="Profile Page"
            backgroundImage= {bg}
            backgroundRepeat= "repeat-y"
            backgroundAttachment= "scroll"
        >

            <div className ="profile">
                <NavigationBar/>
                <div className="page-container" id="profile-page-container">
                    <SideMenu/>
                    <PostFeed type="profile" uid={uid}/>
                    <Chat miniView={true}/>

                </div>
            </div>
        </BackgroundWrapper>
    )
}