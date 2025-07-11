import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";

//Context and tools
import { userContext } from "../../UserProvider";

// Styles and components
import bg from "../../assets/images/scrollableBackground.png";
import BackgroundWrapper from "../../components/base-components/BackgroundWrapper";
import NavigationBar from "../../components/base-components/NavigationBar/NavigationBar";
import SideMenu from "../../components/SideMenu/SideMenu";
import PostFeed from "../../components/PostFeed/PostFeed";

export default function GroupsFeed(){

    const {user} = useContext(userContext);
    const navigation = useNavigate();

    useEffect(()=>{
            if (!user) {
            navigation("/");
        }
    },[user,navigation]);

    return(
    <div>
          <BackgroundWrapper
            title="Group Feed"
            backgroundImage = {bg}
            backgroundPosition = "top center"
            backgroundRepeat="repeat-y"
            backgroundAttachment = "scroll"
            >

            <div className="groups">
                <NavigationBar/>
                <div className="page-container">
                    <SideMenu />
                    <PostFeed type="group"/>
                </div>
            </div>
        </BackgroundWrapper>
    </div>
    );
}