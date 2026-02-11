import {useState, useEffect, useContext} from "react";

// Context and tools
import {userContext} from "../../UserProvider"
import axiosInstance from "../../axiosInstance";
import { findAvatarDB, findUserNameDB, searchDB } from "../../firebase/ReadWriteDB";
import { timeSincePost } from "../../utils";
import useGoTo from "../../hooks/useGoTo.js";

// Components
import PopupModal, { CommentsListWindow, EditPostWindow, LikesListWindow, MessageWindow, StatusWindowWrapper } from "../base-components/PopupModal/PopupModal";
import ScreenTitle from "../base-components/ScreenTitle/ScreenTitle";
import Field from "../base-components/Field/Field";
import DropDownMenu from "../base-components/DropDownMenu/DropDownMenu";
import "./Post.css";

// Icons
import LikeButton from "../base-components/LikeButton/LikeButton.js";
import {EditIcon, DeleteIcon, CommentsIcon} from "../IconSVGs.js";



export default function Post(props){

    //fetchImage
    const {user, fetchImage} = useContext(userContext);
    const {postID, timestamp:postCreationTime} = props;

    const [postTime, setPostTime] = useState(Date(props.timestamp));
    const [postContent, setPostContent] = useState(props.content);
    const [attachment, setAttachment] = useState("");
    const [avatar, setAvatar] = useState("");
    

    // Likes
    const [likes, setLikes] = useState(props.likes);
    const [likesUsernames, setLikesUsernames] = useState([]);
    const [postLiked, setPostLiked] = useState(false);
    // Comments
    const [comments, setComments] = useState(props.comments);
    const [commentsUsernames, setCommentsUsernames] = useState([]);
    const [commentsAvatars, setCommentsAvatars] = useState([]);
    const [commentContent, setCommentContent] = useState("");
    // Popups
    const [popupContentType, setPopupContentType] = useState(""); //Can be popup for comments, likes, or edit post.
    const [popupStatusWindow, setPopupStatusWindow] = useState(null); //Set specific window component to show in status popup (<StatusWindowWrapper status={error,warning..}/>)


    //Handle post creation time
    useEffect(()=>{
        //Set post timestamp formatting..
        setPostTime(timeSincePost(postCreationTime));
        
    },[postCreationTime]);

    //Handle post attachment
    useEffect(()=>{
        if(!props.attachment) return;

        const fetchAttachment = async () => {
            try{
                //DEBUG: console.log("Attempting to fetch attachment..");
                const response = await axiosInstance.get(`/upload/retrieve/${props.attachment}`,{responseType:"blob"}); 
                if(response.status === 200){
                    //DEBUG: console.log("Attachment fetched successfully.");
                    const blob = response.data;
                    const url = URL.createObjectURL(blob);
                    setAttachment(url);
                }
            }
            catch(err){
                console.log(err);
            }
        }

        fetchAttachment();
    },[props.attachment]);

    //Handle post like status
    useEffect(() => {
        if (!user || !likes) return;
        setPostLiked(likes.includes(user.uid));
    }, [likes, user]);


    useEffect (() => {
        //Fetch usernames for likers and commenters
        const fetchLikersUsernames = async () => {
            //Avoid refetching if we already have the data, or avoid fetching if we have no likes.
            if(popupContentType !=="likes" || !likes || (likes.length === likesUsernames.length)) return;
            console.log('Fetching likers usernames...');
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
            if(popupContentType !=="comments" || !comments || (comments.length === commentsUsernames.length))
                {// DEBUG: console.log("avoiding fetching the commenters usernames..." + `\n${commentsUsernames.length}`);
                return;} 
            const usernames = await Promise.all(
                comments.map(async (comment)=> {
                    const username = await findUserNameDB(comment.userId);
                    return username;
                })
            );
            setCommentsUsernames(usernames);
        }

        const fetchAvatar = async () =>{
            try{
                const refernceURL = `/users/${props.author}/settings/avatar`;
                const results = await searchDB(refernceURL);
                //If it's one of the default avatar images
                if(results.includes("static"))
                    return setAvatar(results);

                // DEBUG: console.log("Attempting to fetch profile picture for post author..")
                const fetchedAvatar = await fetchImage(results, false);
                if(fetchedAvatar)
                    return setAvatar(fetchedAvatar);
            }
            catch(err){
                console.log(err);
            }
        }
        fetchAvatar();
        fetchLikersUsernames();
        fetchCommentersUsernames();
        
    }, [likes,comments, popupContentType , likesUsernames ,commentsUsernames, props.author, fetchImage]);

    const fetchCommentersAvatar = async() =>{
        try{
            if(popupContentType !=="comments" || !comments || (comments.length === commentsAvatars.length)) 
            {   
                return; 
            }
            console.log("Attempting to fetch commenters avatars");
            const avatars = await Promise.all(comments.map(async (comment)=>{
                // DEBUG: console.log("Comment: ", comment);
                const avatar = await findAvatarDB(comment.userId);
                if(avatar.includes("static"))
                    return avatar;
                else{
                    const fetchedAvatar = await fetchImage(avatar, false);
                    if(fetchedAvatar)
                        return fetchedAvatar;
                } 
                    
                })
            );
            setCommentsAvatars(avatars);

        }
        catch(err) {
            console.log(err);   
        }
    };

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
    };

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
    };

    const addComment = async () =>{
        if(commentContent.trim() === ""){
            setPopupStatusWindow(
                <StatusWindowWrapper
                    statusType="error"
                    message="Comment cannot be empty."
                    onClose={() => {setPopupStatusWindow(null);}}
                />
            );
            return;
        }
        const payload = { postID, commenterID:user.uid, content:commentContent};
        try{
            const response = await axiosInstance.post("/posts/comment", payload);
            if(response.status===201){
                console.log(response.data.message);
                //DEBUG: console.log("Post after adding comment:", response.data.post);
                setComments(response.data.post.comments);
                setCommentContent("");
                setPopupStatusWindow(
                    <StatusWindowWrapper
                        statusType="success"
                        message={response.data.message}
                        onClose={() => {setPopupStatusWindow(null);}}
                    />
                );
            }
        }
        catch(err){
            console.log(err);
            console.log(err.response?.data?.message);
        }
    };

    const editPost = async (editContent)=> {
        const payload = {content: editContent};
        try{
            const response = await axiosInstance.put(`/posts/${postID}`, payload);
            if(response.status===200){
                console.log(response.data.message);
                setPostContent(editContent);
                setPopupStatusWindow(
                    <StatusWindowWrapper
                        statusType="success"
                        title={response.data.message}
                        message={``}
                        onClose={() => {setPopupStatusWindow(null);}}
                    />
                );
                closePopup();
            }
        }catch(err){ 
            console.log(err); 
            console.log(err.response?.data?.message); 
        }
    };

    const editComment = async (commentID, newContent) => {
        const payload = {content: newContent};
        try{
            const response = await axiosInstance.put(`/posts/comment/${commentID}`, payload);
            if(response.status===200){
                //DEBUG: console.log(response.data.message);
                //DEBUG: console.log("Updated comment:", response.data.comment);
                setPopupStatusWindow(
                    <StatusWindowWrapper
                        statusType="success"
                        title="Comment updated successfully."
                        message={``}
                        onClose={() => {setPopupStatusWindow(null);}}
                    />
                );

                //Update comments state
                const updatedComments = comments.map((comment) => {
                    if(comment._id === commentID){
                        return response.data.comment;
                    }
                    return comment;
                });
                setComments(updatedComments);
            }
        }catch(err){ 
            console.log(err); 
            console.log(err.response?.data?.message);
        }
    };

    const deleteComment = async (commentID) => {
        try{
            const response = await axiosInstance.delete(`/posts/comment/${commentID}`);
            if(response.status===200){
                console.log(response.data.message);
                //Update comments state
                const updatedComments = comments.filter((comment) => comment._id !== commentID);
                setComments(updatedComments);
            }
        }catch(err){
            console.log(err);
            console.log(err.response?.data?.message);
        }
    };

    const getPopupContent = () => {
        switch(popupContentType){
            case "likes":
                return (
                    <ul className="popup-list">
                        <LikesListWindow likesUsernames={likesUsernames}/>
                    </ul>
                );
            case "comments":
                return (
                    <>
                    <div id="post-preview">
                        <PostHeader 
                            avatar={avatar} 
                            name={props.name? props.name : "Unknown User"} 
                            postTime={postTime} openPopup={openPopup} 
                            user={user} 
                            author={props.author}
                            onDelete={props.onDelete}/> 
                        <PostBody postContent={postContent} attachment={attachment}/>
                    </div>
                    <CommentsListWindow 
                        comments={comments} 
                        commentsUsernames={commentsUsernames} 
                        commentsAvatars={commentsAvatars} 
                        timeSincePost={timeSincePost} 
                        onEditComment={editComment} 
                        onDeleteComment={deleteComment}/>
                    <PostComment 
                        commentContent={commentContent} 
                        setCommentContent={setCommentContent} 
                        addComment={addComment} 
                        embedded={true}/>
                </>
                );
            case "edit":
                return (
                    <EditPostWindow editPost={editPost} content={postContent} />
                );
            case "message":
                return (
                    <MessageWindow receiver={props.author} onClose={closePopup}/>
                );
            default:
                return null;
        }
    };

    const openPopup = (type)=>{
        if(type === "likes" && (!likes || likes.length===0)) return;
        if(type === "comments" && (!comments || comments.length===0)) return;

        setPopupContentType(type);
    };

    const closePopup = ()=>{
        setPopupContentType("");
    };
    
    fetchCommentersAvatar(); 

    let pageTitle;
    switch(popupContentType){
        case "likes":
            pageTitle = "Liked By";
            break;
        case "comments":
            pageTitle = "Comments";
            break;
        case "edit":
            pageTitle = "Edit Post";
            break;
        case "message":
            pageTitle = "Message";
            break;
        default:
            pageTitle = "N/A";
    }

    return(
    <div id="post" >
        <PostHeader 
            avatar={avatar} 
            name={props.name? props.name : "Unknown User"} 
            user={user}
            author={props.author} 
            postTime={postTime} 
            openPopup={openPopup}
            onDelete={props.onDelete} />
        
        <PostBody postContent={postContent} attachment={attachment} />
        <PostFooter 
            openPopup={openPopup}
            user={user}
            author={props.author} 
            postLiked={postLiked} 
            likePost={likePost} 
            unlikePost={unlikePost} 
            likes={likes} 
            comments={comments} 
               
        />
        <PostComment commentContent={commentContent} setCommentContent={setCommentContent} addComment={addComment}/>

        <PopupModal isOpen={!!popupContentType} onClose={closePopup} >
            <ScreenTitle designId={"popup-title"} title={pageTitle}/>
            {getPopupContent()}
        </PopupModal>
        <PopupModal isOpen={!!popupStatusWindow} onClose={() => setPopupStatusWindow(null)}>
           {popupStatusWindow}
        </PopupModal>
    </div>
    );
};

const PostHeader = (props)=>{

    const goTo = useGoTo();

    return(
        <div id="post-header">
            <DropDownMenu styleClass="user-dropdown" options={["Message", "Profile"]} optionsMetaData={[()=>{props.openPopup("message")}, ()=>goTo(`/profile/${props.author}`)]} onChange={(_, optionFunc)=>{ if(optionFunc) optionFunc();}}>
                <img className="post-avatar" src={props.avatar} alt="avatar" />
            </DropDownMenu>
            <div className="post-user-info">
                <h2 className="post-username">{props.name}</h2>
                <span className="timestamp">{props.postTime}</span>
            </div>
            {(props.user.uid === props.author) &&
            (
            <div id="settings">
                <button className="post-action-button" onClick={() => props.openPopup("edit")}><EditIcon size="25"/></button>
                <button className="post-action-button" onClick = {props.onDelete}><DeleteIcon/></button>
            </div>)
            }
        </div>
    );
}

const PostBody = (props)=>{
    const dummyPostContent = 
    `Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim
    labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi
    animcupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est
    aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia
    pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit
    commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa
    proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia
    eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim.
    Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et
    culpa duis.`;
    return(
        <div id="post-body">
            {props.attachment && <img className="post-attachment" src={props.attachment} alt="post attachment"/>}
            <p>{props.postContent?? dummyPostContent}</p>
        </div>
    );
}

const PostComment = (props) =>{
    return(
        <div id="post-add-comment" className={props.embedded? "embedded-comment-box" : ""}>
            <Field 
                type="text" 
                value={props.commentContent} 
                onChange={(e)=>props.setCommentContent(e.target.value)} 
                prompt="Comment..."/>
            <button className="submit-button" id="comment-button" onClick={props.addComment}>comment</button>
        </div>
    );
}

const PostFooter = (props) =>{
    return(
        <div id="post-footer">
            <div id="likes-comments">
                <LikeButton buttonId="like-unlike-button" 
                    postLiked={props.postLiked} 
                    additionalClass="post-button"
                    onClick={props.postLiked ? props.unlikePost : props.likePost}/>
                <button id="likes-button" className="post-button" onClick={() => props.openPopup("likes")}>
                    <span>{props.likes?.length || 0}</span>
                </button>
                <button className="post-button" onClick={() => props.openPopup("comments")}>
                    <CommentsIcon size="30"/>
                    <span>{`${props.comments.length || 0} comments`}</span>
                </button> 
            </div>
           
        </div>
    );
}