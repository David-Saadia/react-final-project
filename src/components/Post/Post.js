import {useState, useEffect, useContext} from "react";

// Context and tools
import {userContext} from "../../UserProvider"
import axiosInstance from "../../axiosInstance";
import { findUserNameDB } from "../../firebase/ReadWriteDB";

// Components
import PopupModal from "../base-components/PopupModal/PopupModal";
import ScreenTitle from "../base-components/ScreenTitle/ScreenTitle";
import Field from "../base-components/Field/Field";
import FieldArea from "../base-components/FieldArea/FieldArea";
import defaultAvatar from "../../assets/images/avatars/avatar_default.png";
import "./Post.css";
/**
 * 
 * @param {object} props - props object to contain all parameters 
 * @param {string} [props.name] - name to display on the post
 * @param {string} [props.content] - avatar to display on the post
 * @param {[string]} [props.likes] - avatar to display on the post
 * @param {[{author:string,content:string}]} [props.comments] - avatar to display on the post
 * @param {function} props.onDelete - function to preform on delete button pressed.
    
 }}
 * 
 * @returns 
 */
export default function Post(props){

    const [postTime, setPostTime] = useState(Date(props.timestamp));
    const postCreationTime = props.timestamp;
    const {user} = useContext(userContext);
    const {postID} = props;
    const [postContent, setPostContent] = useState(props.content);
    const [editContent, setEditContent] = useState(props.content);
    

    // Likes
    const [likes, setLikes] = useState(props.likes);
    const [likesUsernames, setLikesUsernames] = useState([]);
    const [postLiked, setPostLiked] = useState(false);
    // Comments
    const [comments, setComments] = useState(props.comments);
    const [commentsUsernames, setCommentsUsernames] = useState([]);
    const [commentContent, setCommentContent] = useState("");
    // Popup
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupContentType, setPopupContentType] = useState(""); //Can be popup for comments, likes, or edit post.

    useEffect(()=>{
        //Set post timestamp formatting..
        setPostTime(timeSincePost(postCreationTime));
        
    },[postCreationTime]);


    useEffect(() => {
        if (!user || !likes) return;
        setPostLiked(likes.includes(user.uid));
    }, [likes, user]);


    useEffect (() => {
        //Fetch usernames for likers and commenters
        const fetchLikersUsernames = async () => {
            //Avoid refetching if we already have the data, or avoid fetching if we have no likes.
            if(popupContentType !=="likes" || !likes || (likes.length === likesUsernames.length)) return;
            const usernames = await Promise.all(
                likes.map(async (uid)=> {
                    const username = await findUserNameDB(uid);
                    return {uid, username};
                })
            );
            setLikesUsernames(usernames);
        }

        const fetchCommentersUsernames = async () => {
            //Avoid refetching if we already have the data, or avoid fetching if we have no comments.
            if(popupContentType !=="comments" || !comments || (comments.length === commentsUsernames.length)) return;
            const usernames = await Promise.all(
                comments.map(async (comment)=> {
                    const username = await findUserNameDB(comment.userId);
                    return username;
                })
            );
            setCommentsUsernames(usernames);
        }
        fetchLikersUsernames();
        fetchCommentersUsernames();

    }, [likes,comments, popupContentType , likesUsernames ,commentsUsernames]);

    const timeSincePost = (time) =>{
        const timePassed = Date.now() - new Date(time);
        // DEBUG: console.log(timePassed);

        const seconds= Math.floor(timePassed/1000);
        const minutes= Math.floor(seconds/60);
        const hours= Math.floor(minutes/60);
        const days= Math.floor(hours/24);

        if (days > 0) return (days===1)? "1 day ago" : `${days} days ago`;
        if (hours > 0) return (hours===1)? "1 hour ago" : `${hours} hours ago`;
        if (minutes > 0) return (minutes===1)? "1 minute ago" : `${minutes} minutes ago`;
        return "Just now";

    }


    const unlikePost = async ()=>{

        const payload = { postID:props.postID, likeeUID:user?.uid };

        try{
            const response = await axiosInstance.post("/posts/unlike",payload);
            if(response.status===201){
                console.log(response.data.message);
                setLikes(response.data.post.likes);
                setPostLiked(false);
            }
        }
        catch(err){ console.log(err); }

    }

    const likePost = async () =>{

        const payload = {postID:props.postID, likeeUID:user?.uid};

        try{
            const response = await axiosInstance.post("/posts/like",payload);
            if(response.status===201){
                console.log(response.data.message);
                setLikes(response.data.post.likes);
                setPostLiked(true);
            }
        }catch(err){ console.log(err);}

    }

    const addComment = async () =>{
        
        const payload = { postID, commenterID:user.uid, content:commentContent};

        try{
            const response = await axiosInstance.post("/posts/comment", payload);
            if(response.status===201){
                console.log(response.data.message);
                setComments(response.data.post.comments);
                setCommentContent("");
                alert("Comment added successfully.");
            }
        }
        catch(err){
            console.log(err);
            console.log(err.response?.data?.message);
        }
    }

    const editPost = async ()=> {
        const payload = {content: editContent};

        try{
            const response = await axiosInstance.put(`/posts/${postID}`, payload);
            if(response.status===200){
                console.log(response.data.message);
                setPostContent(editContent);
                closePopup();
            }

        }catch(err){ console.log(err); console.log(err.response?.data?.message); }
    }

    const openPopup = (type)=>{
        if(type === "likes" && (!likes || likes.length===0)) return;
        if(type === "comments" && (!comments || comments.length===0)) return;
        setPopupContentType(type);
        setIsPopupOpen(true);
    }

    const closePopup = ()=>{
        setIsPopupOpen(false);
        setPopupContentType("");
    }


    return(<>
    <div id="post" >
        <div id="post-header">
            <img src={props.avatar? props.avatar : defaultAvatar} alt="avatar" />
            <h2>{props.name? props.name : "Unknown User"}</h2>
            <span className="timestamp">{postTime}</span>
        </div>
        <div id="post-body">
            <p>{postContent? postContent : "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"}</p>
        </div>
        <div id="post-add-comment">
            <Field 
                type="text" 
                value={commentContent} 
                onChange={(e)=>setCommentContent(e.target.value)} 
                prompt="Comment..."/>
            <button className="submit-button" id="comment-button" onClick={addComment}>comment</button>
        </div>
        <div id="post-footer">
            <div id="likes-comments">
                
                {/**This wil like/unlike the post */}
                {postLiked?
                <button onClick={unlikePost}>Unlike</button>:
                <button onClick={likePost}>Like</button>} 

                {/**This will show the number of likes and when clicked on will show the users that have liked the post */}
                <button onClick={() => openPopup("likes")}>{likes?.length || 0}</button> 
                
                {/**This will show the comments on the post */}
                <button onClick={() => openPopup("comments")}>{`${comments.length || 0} comments`}</button> 
            </div>
            <div id="settings">
                <button onClick={() => openPopup("edit")}>Edit</button>
                <button onClick = {props.onDelete}>Delete</button>
            </div>
        </div>
        <PopupModal isOpen={isPopupOpen} onClose={closePopup} >
            <ScreenTitle title={popupContentType==='likes'? 'Liked By': popupContentType==='comments'? 'Comments':'Edit Post'}/>
            {!popupContentType==='edit' && (<ul className="popup-list">
                    {/*Likes items section */}
                    {popupContentType==="likes" &&
                    likesUsernames.map( ({ uid, username }, index) => <ScreenTitle design_id="post-username" title={username}/>)}

                    {/*Comments items section */}
                    {popupContentType==="comments" &&
                        comments.map((comment, index) =>

                            <li id="comment-item" key={index}>
                                <div id="commment-header">
                                    <ScreenTitle title={commentsUsernames[index]} design_id="post-username"/>
                                    <span id="comment-timestamp">{timeSincePost(comment.timestamp)}</span>
                                </div>
                                <div id="comment-body">
                                    {comment.content}
                                </div>
                            </li>
                         
                        )}
                </ul>)}
                {/*Edit comment section */}
                {popupContentType=== 'edit' && (
                    <div>
                        <FieldArea 
                            prompt="Edit Post.." 
                            styleId="new-post-field" value={editContent} 
                            onChange={(e)=>setEditContent(e.target.value)}/>
                        <button
                            className="submit-button"
                            id="submit-post-button"
                            onClick={editPost}>
                                Edit Post
                        </button>
                    </div>
                )
    
                }
        </PopupModal>
    </div>
        </>);
};