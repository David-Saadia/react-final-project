import { useParams } from "react-router-dom";

//Context and tools

import { useRequireAuth } from "../../hooks/useRequireAuth";


// Components
import NavigationBar from "../../components/base-components/NavigationBar/NavigationBar";
import BackgroundWrapper from "../../components/base-components/BackgroundWrapper";
import PostFeed from "../../components/PostFeed/PostFeed";
import bg from "../../assets/images/background-postfeed-light.png";
import MobileBaseLayout from "../../components/base-components/MobileBaseLayout/MobileBaseLayout";


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
                <MobileBaseLayout pageContainerId="profile-page-container">
                    <PostFeed type="profile" uid={uid}/>
                </MobileBaseLayout>
            </div>
        </BackgroundWrapper>
    )
}