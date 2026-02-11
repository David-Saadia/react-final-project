import { useContext, useEffect, useState } from "react";

//Context and tools
import { findAvatarDB, findUserNameDB } from "../../firebase/ReadWriteDB";
import { userContext } from "../../UserProvider";
import { timeSincePost } from "../../utils";

//Components and styles
import defaultAvatar from "../../assets/images/avatars/avatar_black.png";
import "./Message.css";

export default function Message(props){
    const [avatar, setAvatar] = useState("");
    const [userName, setUsername] = useState("");
    const {message} = props
    const {user, fetchImage} = useContext(userContext);

    const isSelf = message.author === user?.uid;

    useEffect(()=>{
        const fetchAvatarAndUsername = async () => {
            try{
                const avatar = await findAvatarDB(message.author);
                const username = await findUserNameDB(message.author);
                //console.log("avatar from message: ", avatar);
                if(avatar.includes("static")) 
                    setAvatar(avatar);
                else{
                    const fetchedAvatar = await fetchImage(avatar, false);

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
    }, [message.author, fetchImage]);


    return(
        <li id={`msg-${message._id}`} className={`message-item ${isSelf ? "self" : "other"} ${props.isHighlighted? "highlight": ""}`}>
            <div className="message-avatar-container">
                <img src={avatar || defaultAvatar} title="avatar" alt="" className="message-avatar"/>
            </div>
            <div className="message-content-wrapper">
                <div className="message-bubble">
                    {!isSelf && <div className="message-username">{userName || "\u00A0"}</div>}
                    <div className="message-text">{message.content}</div>
                </div>
                <div className="message-timestamp">{timeSincePost(message.timestamp)}</div>
            </div>
        </li>
    );
}