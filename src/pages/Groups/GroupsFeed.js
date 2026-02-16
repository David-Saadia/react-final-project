
import { useContext, useEffect } from "react";

//Context and tools
import { userContext } from "../../UserProvider";
import { useSearchParams } from "react-router-dom";
import useGoTo from "../../hooks/useGoTo";

// Styles and components
import bg from "../../assets/images/background-postfeed-light.png";
import BackgroundWrapper from "../../components/base-components/BackgroundWrapper";
import NavigationBar from "../../components/base-components/NavigationBar/NavigationBar";
import MobileBaseLayout from "../../components/base-components/MobileBaseLayout/MobileBaseLayout";
import PostFeed from "../../components/PostFeed/PostFeed";
import "./Groups.css";

export default function GroupsFeed(){

    const [searchParams] = useSearchParams();
    const {user} = useContext(userContext);
    const chatId = searchParams.get("cid");
    const goTo = useGoTo();

    //DEBUG: console.log("chatId in groups feed: ", chatId);

    useEffect(()=>{
            if (!user) {
            goTo("/");
        }
    },[user,goTo]);

    return(
    <>
          <BackgroundWrapper
            title="Group Feed"
            backgroundImage = {bg}
            backgroundPosition = "top center"
            backgroundRepeat="repeat-y"
            backgroundAttachment = "scroll"
            >

            <div className="groups">
                <NavigationBar/>
                <MobileBaseLayout preSelectedChat={chatId}>
                    <PostFeed className="center-container" type="group"/>
                </MobileBaseLayout>
               
            </div>
        </BackgroundWrapper>
    </>
    );
}