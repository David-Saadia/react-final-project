

//Context and tools

import { useRequireAuth } from "../../hooks/useRequireAuth";


// Components
import NavigationBar from "../../components/base-components/NavigationBar/NavigationBar";
import BackgroundWrapper from "../../components/base-components/BackgroundWrapper";
import SideMenu from "../../components/SideMenu/SideMenu";
import PostFeed from "../../components/PostFeed/PostFeed";
import bg from "../../assets/images/scrollableBackground.png";
import Chat from "../Chat/Chat";

export default function Profile() {

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
                    <PostFeed type="profile"/>
                    <Chat miniView={true}/>

                </div>
            </div>
        </BackgroundWrapper>
    )
}