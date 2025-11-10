import ReactDOM from "react-dom";
import { startTransition, useContext, useEffect, useState} from "react";

//Context and tools
import { userContext } from "../../../UserProvider";

//Components and styles
import Field from "../Field/Field";
import FieldArea from "../FieldArea/FieldArea";
import ScreenTitle from "../ScreenTitle/ScreenTitle";
import "./PopupModal.css"
import axiosInstance from "../../../axiosInstance";
import { useNavigate } from "react-router-dom";
import ImageSelector from "../ImageSelector/ImageSelector";
import {BarGraph, LineGraph} from "../../BarLineChart/BarChart";
/**
 * 
 * @param {object} props - To hold all arguments.
 * @param { function } props.onClose - onClose function to execute when the X button is clicked (or we try to close the window)
 * @param { boolean } props.isOpen - Boolean value to determine if the popup is open or not. 
 * @param { any } props.children - children to wrap with this component - content of the popup window.
 * @returns {JSX.PopupModal} 
 */
export default function PopupModal(props){
    
    //This prevents background scrolling.
    useEffect(()=> {
    if (props.isOpen) document.body.classList.add("modal-open");
    else document.body.classList.remove("modal-open");
    return () => document.body.classList.remove("modal-open");
    },[props.isOpen]);

    if(!props.isOpen) return null;


    //This portal basically allows nesting this component in other components but still having
    // it have the document.body constraits and not the parents constraits, so we can fill the entire screen.
    return ReactDOM.createPortal(
             <div id="popup-backdrop" onClick={props.onClose}>
            <div className="popup-content" id={props.styleId} onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={props.onClose}>X</button>
                {props.children}
            </div>
        </div>,
        document.body
    );
      
}

export function StatisticsNewImageWindow(props){
    
    const [image, setImage] = useState(null);
    const {groupId} = props;
    const {user} = useContext(userContext);
    const [groupPostData, setGroupPostData] = useState([]);
    const [groupMessagesData, setGroupMessagesData] = useState([]);

    const changeGroupImage = async ()=>{
        if(!groupId || !image) return;
        const formData = new FormData();
        formData.append("image", image);
        formData.append("filePath" ,"/groups");
        axiosInstance.post("/upload/image", formData ).then(response=>{
            if(response.status===201){
                const payload= {logo:response.data.file._id, adminId:user.uid, groupId:groupId};
                axiosInstance.put(`/groups/${groupId}`,payload ).then(res=>{
                    if(res.status===200){
                        console.log(res.data.message);
                        alert("Group image changed successfully.");
                    }
                });
            }
        } ).catch(err=>console.log(err));
            
    }

    useEffect(()=>{
        const fetchGroupPostStats = async () => {
            console.log("Fetching group post stats");
            axiosInstance.get(`/statistics/posts/${groupId}`, {adminId:user.uid, groupId:groupId}).then(response=>{
                if(response.status===200){
                    setGroupPostData(response.data);
                }
            }).catch(err=>console.log(err));
        }

        const fetchGroupMessagesStats = async () => {
            console.log("Fetching group messsages stats");
            axiosInstance.get(`/statistics/messages/${groupId}`, {adminId:user.uid, groupId:groupId}).then(response=>{
                if(response.status===200){
                    setGroupMessagesData(response.data);
                }
            }).catch(err=>console.log(err));
        }

        fetchGroupPostStats();
        fetchGroupMessagesStats();
          
    },[groupId, user]);

    return(
    <>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", flexDirection:"row"}}>
            <ScreenTitle title="New Image"/>
            <ImageSelector onSelectImage={(img)=>setImage(img)}/>
        </div>
        <button onClick={changeGroupImage} className="submit-button">Change</button>
        <div className="settings-divider"/>
        <BarGraph title="Posts per month" data={groupPostData}/>
        <LineGraph title="Messages per month" data={groupMessagesData}/>


    </>
    );
}


/**
 * MessageWindow: A popup window that allows the user to send a message to a different user.
 * @param {object} props - The properties to be passed to the MessageWindow component.
 * @param {string} props.receiver - The user id of the receiver of the message.
 * @param {function} props.onClose - The callback function when the popup modal is closed.
 * @returns {JSX.Element} A JSX element representing the MessageWindow component.
 */
export function MessageWindow(props){
    
    const [message, setMessage] = useState("");
    const {receiver} = props;
    const {user} = useContext(userContext);
    const navigation = useNavigate();

    const goTo = (path) => {
        startTransition(() => {
            navigation(path);
        });
    }

    const createChat = async ()=>{
        try{
            const payload= {content:message, author:user.uid, receiver:receiver};
            //DEBUG: console.log(payload);
            if(!payload.content || !payload.author || !payload.receiver) return;

            const response= await axiosInstance.post("/chats/message" , payload);
            if(response.status===201){
                const chatId = response.data.chat._id;
                //DEBUG: console.log(response.data.message);
                alert(response.data.message);
                setMessage("");
                props.onClose();
                goTo(`/chat/${chatId}`);
            }
        }
        catch(err){
            console.log(err);
        }
    };

    return(<>
        <Field
            value={props.message}
            onChange={(e)=>setMessage(e.target.value)}
            prompt="Message"/>
        <button className="submit-button" id="message-button" onClick={()=>createChat()}>Send</button>
    </>);
}

/**
 * InviteWindow: A popup window that allows the user to invite another user to a group.
 * @param {object} props - The properties to be passed to the InviteWindow component.
 * @param {function} props.onInviteFriend - A function to be called when the 'invite' button is clicked.
 * The function should take two arguments: the first is the event, and the second is the username to invite.
 * @returns {JSX.Element} A JSX element representing the InviteWindow component.
 */
export function InviteWindow(props){

    const [inviteMember, setInviteMember] = useState("");

    return(<>
        <ScreenTitle title="Invite your friends"/>
        <Field
            value={inviteMember}
            onChange={(e)=>setInviteMember(e.target.value)}
            prompt="Friend Username"/>
        <button className="submit-button" id="invite-button" onClick={(e)=>{props.onInviteFriend(e,inviteMember); setInviteMember("");}}>Invite</button>
    </>);
}

/**
 * MembersListWindow: A popup window that displays a list of members of a group.
 * @param {object} props - The properties to be passed to the MembersListWindow component.
 * @param {{uid: string, username: string}[]} props.members - An array of objects containing the uid and username of the members of the group.
 * @param {string[]} props.membersAvatars - An array of urls of the members' avatars.
 * @param {function} props.removeMember - A function to be called when the 'remove' button is clicked.
 * The function should take one argument: the uid of the member to be removed.
 * @returns {JSX.Element} A JSX element representing the MembersListWindow component.
 */
export function MembersListWindow(props){
    return(<>
        {props.members?.map(({uid, username}, index) =>{
            
            return (
                <div className="grouped" key={index} id="popup-member-item">
                    <img src={props.membersAvatars[index]} alt="member_avatar"/>
                    <ScreenTitle key={index} designId="popup-member-title" designClass="post-username" title={username}/>
                    <div className="grouped-mashed">
                        <button className={`submit-button ${props.admins.includes(uid)? "disabled" : ""}`} id="promote-member-button" onClick={(e) => props.onPromote(uid)}>Promote</button>
                        <button className={`submit-button ${props.self === uid ? "disabled" : ""}`} id="remove-member-button" onClick={(e) => props.removeMember(uid)}>Kick</button>
                    </div>
                </div>
            );
        })} 
    </>);
}

/**
 * ConfigureGroupWindow: A popup window that allows the user to configure group settings.
 * 
 * @param {object} props - The properties to be passed to the ConfigureGroupWindow component.
 * @param {string} props.groupName - The current name of the group to be edited.
 * @param {function} props.onRenameGroup - A function to be called when the 'Rename' button is clicked. 
 * It takes the new group name as an argument.
 * @param {{uid: string, username: string, avatar: string}[]} props.joinRequests - An array of objects 
 * representing join requests, containing the uid, username, and avatar of each requester.
 * @param {function} props.onAcceptInvite - A function to be called when the 'Accept' button is clicked 
 * for a join request. It takes the uid of the requester as an argument.
 * @param {function} props.onDeclineInvite - A function to be called when the 'Decline' button is clicked 
 * for a join request. It takes the uid of the requester as an argument.
 * 
 * @returns {JSX.Element} A JSX element representing the ConfigureGroupWindow component.
 */
export function ConfigureGroupWindow(props){

    const [newGroupName, setNewGroupName] = useState(props.groupName);
    return(<>
        <div className="grouped">
            <Field value={newGroupName} onChange={(e)=>setNewGroupName(e.target.value)} prompt="Group Name" />\
            <button className="submit-button" id="rename-group-button" onClick={(e)=>props.onRenameGroup(newGroupName)}>Rename</button>
        </div>
        <div>
            {props.joinRequests?.map(({uid, username, avatar}, index) =>{
               //DEBUG: console.log(`uid: ${uid}, username: ${username}`);
               return (
                    <div className="grouped" key={index} id="popup-member-item">
                        <img src={avatar} alt="member_avatar"/>
                        <ScreenTitle key={index} designId="popup-member-title" designClass="post-username" title={username}/>
                        <button className="submit-button" id="accept-invite-button" onClick={(e) => props.onAcceptInvite(uid)}>Accept</button>
                        <button className="submit-button" id="decline-invite-button" onClick={(e) => props.onDeclineInvite(uid)}>Decline</button>
                    </div>
                );
            })}
        </div>
    </>
    );
}

/**
 * CommentsListWindow: A popup window that displays a list of comments on a post.
 * @param {object} props - The properties to be passed to the CommentsListWindow component.
 * @param {{content: string, timestamp: string}[]} props.comments - An array of comments to be displayed.
 * @param {string[]} props.commentsUsernames - An array of usernames of the commenters.
 * @param {string[]} props.commentsAvatars - An array of urls of the commenters' avatars.
 * @param {function} props.timeSincePost - A function to convert a timestamp to a string that describes the time since the post.
 * @returns {JSX.Element} A JSX element representing the CommentsListWindow component.
 */
export function CommentsListWindow(props){
    return(<>
            {  
            props.comments.map(({content, timestamp}, index) =>{
            console.log(`commentsUsernames[index]= ${props.commentsUsernames[index]}`)
            console.log(`commentsAvatars[index]= ${props.commentsAvatars[index]}`)
            return (   
            <li id="comment-item" key={index}>
                <div id="commment-header">
                    <div className="grouped-horizontal">
                    <img src={props.commentsAvatars[index]} alt="commenter_avatar"/>
                    <ScreenTitle title={props.commentsUsernames[index]} designClass="post-username"/>
                    </div>
                    <span id="comment-timestamp">{props.timeSincePost(timestamp)}</span>
                </div>
                <div id="comment-body">
                    {content}
                </div>
            </li>
            );
        })}
    </>);
}

/**
 * LikesListWindow: A popup window that displays a list of usernames of users who have liked a post.
 * @param {object} props - The properties to be passed to the LikesListWindow component.
 * @param {{uid: string, username: string}[]} props.likesUsernames - An array of objects containing the uid and username of the users who have liked the post.
 * @returns {JSX.Element} A JSX element representing the LikesListWindow component.
 */
export function LikesListWindow(props){
    return(<>
         {props.likesUsernames.map( ({ uid, username }, index) => <ScreenTitle key={index} designId="popup-like-item" designClass="post-username" title={username}/>)}
    </>);
}

/**
 * EditPostWindow: A popup window that allows the user to edit a post.
 * @param {object} props - The properties to be passed to the EditPostWindow component.
 * @param {string} props.content - The content of the post to be edited.
 * @param {function} props.editPost - A function to be called when the user clicks the "Edit Post" button. 
 * It takes the edited content as an argument.
 * @returns {JSX.Element} A JSX element representing the EditPostWindow component.
 */
export function EditPostWindow(props){

    const [editContent, setEditContent] = useState(props.content);
    return(<>
            <div>
                <FieldArea 
                    prompt="Edit Post.." 
                    styleId="new-post-field" value={editContent} 
                    onChange={(e)=>setEditContent(e.target.value)}/>
                <button
                    className="submit-button"
                    id="submit-post-button"
                    onClick={(e)=>props.editPost(editContent)}>
                        Edit Post
                </button>
            </div>
    </>);
}