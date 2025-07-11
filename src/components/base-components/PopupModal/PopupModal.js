import ReactDOM from "react-dom";
import {useEffect, useState} from "react";

import "./PopupModal.css"
import Field from "../Field/Field";
import ScreenTitle from "../ScreenTitle/ScreenTitle";
import FieldArea from "../FieldArea/FieldArea";
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

export function ConfigureGroupWindow(props){

    const [newGroupName, setNewGroupName] = useState(props.groupName);
    return(<>
        <div className="grouped">
            <Field value={newGroupName} onChange={(e)=>setNewGroupName(e.target.value)} prompt="Group Name" />\
            <button className="submit-button" id="rename-group-button" onClick={(e)=>props.onRenameGroup(newGroupName)}>Rename</button>
        </div>
        <div>
            {props.joinRequests?.map(({uid, username, avatar}, index) =>{
               console.log(`uid: ${uid}, username: ${username}`);
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
            // DEBUG: console.log(`commentsUsernames[index]= ${commentsUsernames[index]}`)
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