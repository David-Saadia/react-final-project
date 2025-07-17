import { useContext, useEffect, useState } from "react";

//Context and tools
import { findAvatarDB, findUserNameDB } from "../../firebase/ReadWriteDB";
import { userContext } from "../../UserProvider";
import { timeSincePost } from "../../utils";

//Components and styles
import "./Message.css";

export default function Message(props){
    const [avatar, setAvatar] = useState("");
    const [userName, setUsername] = useState("");
    const {message} = props
    const {user, fetchUserPFP} = useContext(userContext);

    useEffect(()=>{
        const fetchAvatarAndUsername = async () => {
            try{
                const avatar = await findAvatarDB(message.author);
                const username = await findUserNameDB(message.author);
                if(avatar.includes("static")) 
                    setAvatar(avatar);
                else{
                    const fetchedAvatar = await fetchUserPFP(avatar, false);
                    if(fetchedAvatar)
                        setAvatar(fetchedAvatar);
                }
                setUsername(username);
            }
            catch(err){
                console.log(err);
            }
        }
        fetchAvatarAndUsername();
    }, [message.author]);


    return(
        <li className="message grouped">
            {message.author === user?.uid
            ? (
                <>
                    <img src={avatar} alt={`message-avatar`} id="message-avatar"/>
                    <div className="message-content">
                        <div className="message-time">{timeSincePost(message.timestamp)}</div>
                        <div className="chat-bubble">
                            <div className="message-username"><strong>{userName}</strong></div>
                            <div className="message-text">{message.content}</div>
                        </div>
                    </div>
                </>
            )
            : (
                <>
                <div className="message-content">
                    <div className="message-time right">{timeSincePost(message.timestamp)}</div>
                    <div className="chat-bubble right">
                        <div className="message-username right"><strong>{userName}</strong></div>
                        <div className="message-text right">{message.content}</div>
                    </div>
                </div>
                <img src={avatar} alt={`message-avatar`} id="message-avatar"/>
                </>
            )}
            
        </li>
    );
}