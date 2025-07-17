import { useContext, useEffect, useState } from "react";

//Context and tools
import { userContext } from "../../UserProvider";
import { extractAcronym } from "../../utils";
import { findAvatarDB, findUserNameDB } from "../../firebase/ReadWriteDB";
import axiosInstance from "../../axiosInstance";

//Components and styles
import "./ChatList.css"
import ScreenTitle from "../base-components/ScreenTitle/ScreenTitle";


export default function ChatList(props){

    
    const [chatThumbnails, setChatThumbnails] = useState([]);
    const {user, loading, fetchUserPFP} = useContext(userContext);
    const [chatList, setChatList] = useState([]);
    
    useEffect(()=>{
        const fetchChatList = async () => {
            const limit = 20;
            try{
                const response = await axiosInstance.get(`/chats/?userId=${user.uid}&limit=${limit}`);
                if (response.status===200){
                    //DEBUG: console.log(response.data.message);
                    //DEBUG: console.log(response.data.chats);
                    setChatList(response.data.chats);
                }
            }
            catch(err){
                console.log(err);
                console.log(err.response?.data?.message);
            }
        }
        fetchChatList();
    }, [user]);
    
    useEffect(() => {
        const fetchChatThumbnails = async (limit=-1) => {
                if(limit<0 && chatList){
                    if(!user) return;
                    //DEBUG: console.log("Attempting to pull users's chats list names/images")
                    const thumbnails = await Promise.all(chatList.map(async (chatItem) => {
                        let avatar = chatItem.isGroupChat
                        ? await findAvatarDB(chatItem.creator)
                        : await findAvatarDB(chatItem.participants.find(member => member !== user?.uid));

                        if(chatItem.group?.logo && chatItem.isGroupChat){
                            console.log("Attempting to fetch group logo");
                            const fetchedAvatar = await fetchUserPFP(chatItem.group?.logo, false);
                            if(fetchedAvatar)
                                avatar = fetchedAvatar;
                        }
                        else{
                            if(!avatar.includes("static")){
                                const fetchedAvatar = await fetchUserPFP(avatar, false);
                                if(fetchedAvatar)
                                    avatar = fetchedAvatar;
                            }
                        }

                        console.log(avatar);
                        console.log(chatItem);
                        let label = "N/A"
                        try{
                            if(!chatItem.isGroupChat) 
                                label = await findUserNameDB(chatItem.participants.find(member => member !== user?.uid));
                            else {
                                const response = await axiosInstance.get(`/groups/search/${chatItem.group._id}`);
                                if(response.status===200){
                                    label = response.data.group.name;
                                    console.log(label);
                                }
                            }
                        }catch(err){
                            console.log(err);
                        }
                        if(label?.length>10) {
                            if(label.split(" ").length>1)
                                label = extractAcronym(label).slice(0,3);          
                            else
                                label = label.slice(0,7);
                        }
                        //DEBUG: console.log(`label: ${label} avatar: ${avatar}`);

                        return {avatar, label};
                    }));
                    setChatThumbnails(thumbnails);
                }
        }
        fetchChatThumbnails();
    }, [chatList,user, fetchUserPFP]);

    const openChat =(chatIndex)=>{
        console.log("opening chat", chatIndex);
        props.setChatSelected(chatIndex);
    }
    
    if(loading) return <div>Loading...</div>;
    
    return(
    <div className="docked-container" id="chat-list-container">
        <ul className="chat-list">
            {chatThumbnails.map((thumbnail, index) => (
                <li onClick={(e)=>openChat(chatList[index]._id)} className="grouped chat-item" id="chat-i" key={index}>
                    <img id="chat-avatar" src={thumbnail.avatar} alt={thumbnail.label} />
                    <ScreenTitle title={thumbnail.label} designClass="chat-title"/>
                </li>
            ))}
        </ul>    
    </div>

    );
}