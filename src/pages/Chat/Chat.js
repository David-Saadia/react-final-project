import {  useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

//Context and tools
import { useRequireAuth } from "../../hooks/useRequireAuth";

//Components and styles
import bg from "../../assets/images/background-postfeed-light.png";
import ChatRoom from "../../components/ChatRoom/ChatRoom";
import NavigationBar from "../../components/base-components/NavigationBar/NavigationBar";
import BackgroundWrapper from "../../components/base-components/BackgroundWrapper";
import {MobileBaseChatLayout} from "../../components/base-components/MobileBaseLayout/MobileBaseLayout";
import "./Chat.css";

export default function Chat(){
    
    const {chatId} = useParams();
    const [chatSelected, setChatSelected] = useState(chatId || null);
    const navigation = useNavigate();
    useRequireAuth();

    useEffect(()=>{
        if(chatId!==chatSelected) setChatSelected(chatId);
    },[chatId, chatSelected]);


    const handleChatSelect = (id)=>{
        setChatSelected(id);
        navigation(`/chat/${id}`);
    }
    
    return(
        <BackgroundWrapper
            title="Chat"
            backgroundImage = {bg}
            backgroundPosition = "top center"
            backgroundRepeat="repeat-y"
            backgroundAttachment = "scroll"
            >

            <div className="chat">
                <NavigationBar/>
                <MobileBaseChatLayout pageContainerId="chat-container" handleChatSelected={handleChatSelect}>
                    {chatSelected  && (<ChatRoom chatId={chatSelected} />) }
                </MobileBaseChatLayout>
              
            </div>
        </BackgroundWrapper>
    );
}