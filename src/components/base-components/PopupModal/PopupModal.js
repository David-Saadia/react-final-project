import ReactDOM from "react-dom";
import { useContext, useEffect, useState, useRef} from "react";

//Context and tools
import { userContext } from "../../../UserProvider";
import axiosInstance from "../../../axiosInstance";
import useGoTo from "../../../hooks/useGoTo";

//Components and styles
import Field from "../Field/Field";
import FieldArea from "../FieldArea/FieldArea";
import ScreenTitle from "../ScreenTitle/ScreenTitle";
import ImageSelector from "../ImageSelector/ImageSelector";
import {BarGraph, LineGraph} from "../../BarLineChart/BarChart";
import "./PopupModal.css"


/**
 * 
 * @param {object} props - To hold all arguments.
 * @param { function } props.onClose - onClose function to execute when the X button is clicked (or we try to close the window)
 * @param { boolean } props.isOpen - Boolean value to determine if the popup is open or not. 
 * @param { any } props.children - children to wrap with this component - content of the popup window.
 * @returns {JSX.PopupModal} 
 */
export default function PopupModal(props){
    const { isOpen, onClose } = props;
    const backdropMouseDown = useRef(false);
    const backdropRef = useRef(null);
    
    //This prevents background scrolling.
    useEffect(()=> {
        if (isOpen) document.body.classList.add("modal-open");
        
        return () => {
            // Check if there are other modals open before removing the class
            // We use a timeout to allow the DOM to update if a modal is closing
            setTimeout(() => {
                if (document.querySelectorAll('.popup-backdrop').length === 0) {
                    document.body.classList.remove("modal-open");
                }
            }, 0);
        };
    },[isOpen]);

    // Handle ESC key to close the modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                const backdrops = document.querySelectorAll('.popup-backdrop');
                // Only close if this is the topmost modal (last in the DOM)
                if (backdrops.length > 0 && backdrops[backdrops.length - 1] === backdropRef.current) {
                    onClose();
                }
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    //Moved to mouseDown and backDropClick handlers to avoid issues with mouse release outside the backdrop.
    //e.target === e.currentTarget checks if the component clicked is the same as the component with the listener(currentTarget).
    const handleMouseDown = (e) => {
        if (e.target === e.currentTarget) {
            backdropMouseDown.current = true;
        } else {
            backdropMouseDown.current = false;
        }
    };

    const handleBackdropClick = (e) => {
        if (backdropMouseDown.current && e.target === e.currentTarget) {
            onClose();
        }
        backdropMouseDown.current = false;
    };

    if(!isOpen) return null;


    //This portal basically allows nesting this component in other components but still having
    // it have the document.body constraits and not the parents constraits, so we can fill the entire screen.
    return ReactDOM.createPortal(
             <div className="popup-backdrop" ref={backdropRef} onMouseDown={handleMouseDown} onClick={handleBackdropClick}>
            <div className="popup-content" id={props.styleId} onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>X</button>
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
        {/* <BarGraph title="Posts per month" data={groupPostData}/>
        <LineGraph title="Messages per month" data={groupMessagesData}/> */}


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
    const goTo = useGoTo();

    //For now, make a title screen if the user tries to message themselves, later add error screen.
    if(receiver===user.uid){
        return(<>
            <ScreenTitle title="You cannot send messages to yourself."/>
        </>);
    }

    const createChat = async ()=>{
        try{
            //FIX: if a chat is already open with this user, just send the message there.
            const payload= {content:message, author:user.uid, receiver:receiver};
            //DEBUG: console.log(payload);
            if(!payload.content || !payload.author || !payload.receiver) return;

            const response= await axiosInstance.post("/chats/message" , payload);
            if(response.status===200){
                const chatId = response.data.chat._id;
                //DEBUG: console.log(response.data.message);
                alert(response.data.message);
                setMessage("");
                props.onClose();
                goTo(`/chat/${chatId}`);
            }
            if(response.status===269){
                console.log("Chat already exists, redirecting to chat.");
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
            <Field value={newGroupName} onChange={(e)=>setNewGroupName(e.target.value)} prompt="Group Name" />
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
    
    const {user} = useContext(userContext);
    const [editingComment, setEditingComment] = useState(null);
    const [deletingComment, setDeletingComment] = useState(null);

    const handleEdit = (comment) => {
        setEditingComment(comment);
    };

    const handleDelete = (commentId) => {
        setDeletingComment(commentId);
    };

    const submitEdit = (newContent) => {
        if (props.onEditComment && editingComment) {
            props.onEditComment(editingComment._id, newContent);
        }
        setEditingComment(null);
    };

    return(<>
    <ul className="comments-list">
            {  
            props.comments.map((comment, index) =>{
            const {content, timestamp} = comment;
            return (   
            <li className="comment-item" key={index}>
                <div className="comment-header">
                    <div className="comment-user">
                        <img src={props.commentsAvatars[index]} alt="commenter_avatar" className="comment-avatar"/>
                        <span className="comment-username">{props.commentsUsernames[index]}</span>
                    </div>
                    <span className="comment-timestamp">{props.timeSincePost(timestamp)}</span>

                </div>
                <div className="comment-body">
                    <p>{content}</p>
                </div>
                {comment.userId === user.uid &&
                    <div className="comment-controls">
                        <button onClick={() => handleEdit(comment)}>Edit</button>
                        <button onClick={() => handleDelete(comment._id)}>Remove</button>
                    </div>
                }
                
            </li>
            );
        })}
    </ul>
    <PopupModal isOpen={!!editingComment} onClose={() => setEditingComment(null)}>
        <ScreenTitle title="Edit Comment"/>
        <EditPostWindow 
            content={editingComment?.content || ""} 
            editPost={submitEdit} 
        />
    </PopupModal>
    <PopupModal isOpen={!!deletingComment} onClose={() => setDeletingComment(null)}>
        <WarningWindow 
            title="Delete Comment"
            message="Are you sure you want to delete this comment?"
            onConfirm={() => {
                props.onDeleteComment(deletingComment);
                setDeletingComment(null);
            }}
            onCancel={() => setDeletingComment(null)}
        />
    </PopupModal>
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
                        Edit
                </button>
            </div>
    </>);
}

export function StatusWindowWrapper(props){
    const {statusType, message, onClose, title} = props;
    if(statusType === "error") return(<ErrorWindow message={message} onClose={onClose} title={title}/>);
    if(statusType === "success") return(<SuccessWindow message={message} onClose={onClose} title={title}/>);
    if(statusType === "warning") return(<WarningWindow message={message} onClose={onClose} title={title} onConfirm={props.onConfirm} onCancel={props.onCancel}/>);
    return(<AlertWindow message={message} onClose={onClose} title={title}/>);
}



/**
 * ErrorWindow: A popup window that displays an error message.
 * @param {object} props
 * @param {string} props.message - The error message to display.
 * @param {function} props.onClose - Function to be called when the close button is clicked.
 */
export function ErrorWindow(props){
    return(
        <div className="popup-status-window error">
            <ScreenTitle title={props.title ||"Error"} designClass="status-title error-text"/>
            <p className="status-message">{props.message}</p>
            <button className="submit-button" onClick={props.onClose}>Close</button>
        </div>
    );
}

/**
 * SuccessWindow: A popup window that displays a success message.
 * @param {object} props
 * @param {string} props.message - The success message to display.
 * @param {function} props.onClose - Function to be called when the OK button is clicked.
 */
export function SuccessWindow(props){
    return(
        <div className="popup-status-window success">
            <ScreenTitle title={props.title ||"Success"} designClass="status-title success-text"/>
            <p className="status-message">{props.message}</p>
            <button className="submit-button" onClick={props.onClose}>OK</button>
        </div>
    );
}

/**
 * WarningWindow: A popup window that displays a warning message with confirm/cancel options.
 * @param {object} props
 * @param {string} props.message - The warning message to display.
 * @param {function} props.onConfirm - Function to be called when the confirm button is clicked.
 * @param {function} props.onCancel - Function to be called when the cancel button is clicked.
 */
export function WarningWindow(props){
    return(
        <div className="popup-status-window warning">
            <ScreenTitle title={ props.title ||"Warning"} designClass="status-title warning-text"/>
            <p className="status-message">{props.message}</p>
            <div className="grouped-mashed">
                <button className="submit-button cancel-button" onClick={props.onCancel}>Cancel</button>
                <button className="submit-button" onClick={props.onConfirm}>Confirm</button>
            </div>
        </div>
    );
}

/**
 * AlertWindow: A popup window that displays a generic message/notice.
 * @param {object} props
 * @param {string} props.title - The title of the alert (optional, defaults to "Notice").
 * @param {string} props.message - The message to display.
 * @param {function} props.onClose - Function to be called when the OK button is clicked.
 */
export function AlertWindow(props){
    return(
        <div className="popup-status-window alert">
            <ScreenTitle title={props.title || "Notice"} designClass="status-title alert-text"/>
            <p className="status-message">{props.message}</p>
            <button className="submit-button" onClick={props.onClose}>OK</button>
        </div>
    );
}