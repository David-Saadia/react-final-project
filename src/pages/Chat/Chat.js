import {  useEffect, useState } from "react";
//import {useContext} from "react";
import { useNavigate, useParams } from "react-router-dom";

//Context and tools
//import { userContext } from "../../UserProvider";
import { useRequireAuth } from "../../hooks/useRequireAuth";

//Components and styles
import bg from "../../assets/images/scrollableBackground.png";
import ChatList from "../../components/ChatList/ChatList";
import ChatRoom from "../../components/ChatRoom/ChatRoom";
import SideMenu from "../../components/SideMenu/SideMenu";
import NavigationBar from "../../components/base-components/NavigationBar/NavigationBar";
import BackgroundWrapper from "../../components/base-components/BackgroundWrapper";
import Field from "../../components/base-components/Field/Field";
import "./Chat.css";

export default function Chat({miniView = false}){
    
    const {chatId} = useParams();
    const [chatSelected, setChatSelected] = useState(chatId || null);
    const navigation = useNavigate();
    //const {user} = useContext(userContext);
    useRequireAuth();

    useEffect(()=>{
        if(chatId!==chatSelected) setChatSelected(chatId);
    },[chatId, chatSelected]);


    const handleChatSelect = (id)=>{
        setChatSelected(id);
        navigation(`/chat/${id}`);
        
    }
    
    if( miniView)
        return (<ChatList setChatSelected={handleChatSelect}/>)

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
                <SideMenu/>
                <div className="page-container" id="chat-container">
                    <div className="grouped">
                        <Field type="text" prompt="Search..." styleClass="search-bar" styleId="chat-search"/>
                        <button>Search</button>
                    </div>
                    {chatSelected  && (<ChatRoom chatId={chatSelected} />) }   
                </div>
                <ChatList setChatSelected={handleChatSelect}/>
            </div>
        </BackgroundWrapper>
    );
}