import {useState, useEffect, useContext} from "react";

// Context and tools
import {userContext} from "../../UserProvider"
import axiosInstance from "../../axiosInstance";
import { findAvatarDB, findUserNameDB, searchDB } from "../../firebase/ReadWriteDB";
import { timeSincePost } from "../../utils";

// Components
import PopupModal, { CommentsListWindow, EditPostWindow, LikesListWindow, MessageWindow } from "../base-components/PopupModal/PopupModal";
import ScreenTitle from "../base-components/ScreenTitle/ScreenTitle";
import Field from "../base-components/Field/Field";
import DropDownMenu from "../base-components/DropDownMenu/DropDownMenu";
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

    const {user, fetchUserPFP} = useContext(userContext);
    const {postID} = props;
    const postCreationTime = props.timestamp;
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
    // Popup
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupContentType, setPopupContentType] = useState(""); //Can be popup for comments, likes, or edit post.

    useEffect(()=>{
        //Set post timestamp formatting..
        setPostTime(timeSincePost(postCreationTime));
        
    },[postCreationTime]);

    useEffect(()=>{
        if(!props.attachment) return;

        const fetchAttachment = async () => {
            try{
                console.log("Attempting to fetch attachment..");
                const response = await axiosInstance.get(`/upload/retrieve/${props.attachment}`,{responseType:"blob"}); 
                if(response.status === 200){
                    console.log("Attachment fetched successfully.");
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
                if(results.includes("static"))
                    return setAvatar(results);
                const fetchedAvatar = await fetchUserPFP(results, false);
                if(fetchedAvatar)
                    return setAvatar(fetchedAvatar);
            }
            catch(err){
                console.log(err);
            }
        }
        fetchLikersUsernames();
        fetchCommentersUsernames();
        
        fetchAvatar();
        // DEBUG: console.log(comments);
        // DEBUG: console.log(commentsUsernames);

    }, [likes,comments, popupContentType , likesUsernames ,commentsUsernames, props.author, fetchUserPFP]);

    const fetchCommentersAvatar = async() =>{
        try{
            if(popupContentType !=="comments" || !comments || (comments.length === commentsUsernames.length)) 
                return; 
            console.log("Attempting to fetch commenters avatars");
            const avatars = await Promise.all(comments.map(async (comment)=>{
                const avatar = await findAvatarDB(comment.userId);
                if(avatar.includes("static"))
                    return avatar;
                else{
                    const fetchedAvatar = await fetchUserPFP(avatar, false);
                    if(fetchedAvatar)
                        return fetchedAvatar;
                } 
                    
                })
            );
            // DEBUG: console.log(avatars);
            setCommentsAvatars(avatars);

        }
        catch(err) {
            console.log(err);   
        }
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

    const editPost = async (editContent)=> {
        const payload = {content: editContent};

        try{
            const response = await axiosInstance.put(`/posts/${postID}`, payload);
            if(response.status===200){
                console.log(response.data.message);
                setPostContent(editContent);
                alert(response.data.message);
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
        <PostHeader avatar={avatar} name={props.name? props.name : "Unknown User"} postTime={postTime} openPopup={openPopup}/>
        <PostBody postContent={postContent} attachment={attachment}/>
        <PostComment commentContent={commentContent} setCommentContent={setCommentContent} addComment={addComment}/>
        <PostFooter 
            openPopup={openPopup}
            user={user}
            author={props.author} 
            postLiked={postLiked} 
            likePost={likePost} 
            unlikePost={unlikePost} 
            likes={likes} 
            comments={comments} 
            onDelete={props.onDelete}    
        />

        <PopupModal isOpen={isPopupOpen} onClose={closePopup} >
            <ScreenTitle designId={"popup-title"} title={pageTitle}/>
            {popupContentType!=='edit' && (<ul className="popup-list">
                {/*Likes items section */}
                {popupContentType==="likes" && (<LikesListWindow likesUsernames={likesUsernames}/>)}
                {/*Comments items section */}
                {popupContentType==="comments" && (<>
                    <div id="post-preview">
                        <PostHeader avatar={avatar} name={props.name? props.name : "Unknown User"} postTime={postTime} openPopup={openPopup}/>
                        <PostBody postContent={postContent}/>
                    </div>
                    <CommentsListWindow comments={comments} commentsUsernames={commentsUsernames} commentsAvatars={commentsAvatars} timeSincePost={timeSincePost}/>
                </>)}
            </ul>)}
            {/*Edit comment section */}
            {popupContentType=== 'edit' && (<EditPostWindow editPost={editPost}/>)}
            {/*Message section */}
            {popupContentType=== 'message' && (<MessageWindow receiver={props.author} onClose={closePopup}/>)}
        </PopupModal>
    </div>
        );
};

/**
 * A functional component that displays a post header.
 * 
 * @param {object} props - The props object.
 * @param {string} props.avatar - The url of the avatar to display.
 * @param {string} props.name - The name to display.
 * @param {string} props.postTime - The timestamp to display.
 * 
 * @returns A JSX element representing the post header.
 */
const PostHeader = (props)=>{
    return(
        <div id="post-header">
            
            <DropDownMenu styleId={"message-menu"} options={["Message"]} onChange={()=>{props.openPopup("message")}}>
                <img className="post-avatar" src={props.avatar} alt="avatar" />
            </DropDownMenu>
            <h2>{props.name}</h2>
            <span className="timestamp">{props.postTime}</span>
        </div>
    );
}

/**
 * A functional component that displays the content of a post.
 * If the post content is not given, it displays a dummy text.
 * @param {object} props - The props object.
 * @param {string} props.postContent - The content of the post.
 * @returns A JSX element representing the post content.
 */
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
            <p>{props.postContent?? dummyPostContent}</p>
            {props.attachment && <img className="post-attachment" src={props.attachment} alt="post attachment"/>}
        </div>
    );
}

/**
 * A functional component that provides an input field for adding comments
 * to a post and a button to submit the comment.
 * 
 * @param {object} props - The properties for the PostComment component.
 * @param {string} props.commentContent - The current content of the comment input field.
 * @param {function} props.setCommentContent - A function to update the commentContent state.
 * @param {function} props.addComment - A function to handle the addition of a comment when the button is clicked.
 */
const PostComment = (props) =>{

    return(
        <div id="post-add-comment">
            <Field 
                type="text" 
                value={props.commentContent} 
                onChange={(e)=>props.setCommentContent(e.target.value)} 
                prompt="Comment..."/>
            <button className="submit-button" id="comment-button" onClick={props.addComment}>comment</button>
        </div>
    );
}

/**
 * A functional component that displays a post footer.
 * It contains a section that allows liking/unliking a post and shows the number of likes,
 * a section that shows the number of comments and allows the user to view all comments when clicked on,
 * and a section that allows the author to edit or delete the post.
 * 
 * @param {object} props - The properties for the PostFooter component.
 * @param {boolean} props.postLiked - Whether the user has liked the post or not.
 * @param {function} props.likePost - A function to like the post.
 * @param {function} props.unlikePost - A function to unlike the post.
 * @param {string[]} props.likes - The users that have liked the post.
 * @param {function} props.openPopup - A function to open a popup window.
 * @param {object[]} props.comments - The comments on the post.
 * @param {function} props.onDelete - A function to delete the post.
 */
const PostFooter = (props) =>{
    
    return(
        <div id="post-footer">
            <div id="likes-comments">
                
                {/**This wil like/unlike the post */}
                {props.postLiked?
                <button onClick={props.unlikePost}>Unlike</button>:
                <button onClick={props.likePost}>Like</button>} 

                {/**This will show the number of likes and when clicked on will show the users that have liked the post */}
                <button onClick={() => props.openPopup("likes")}>{props.likes?.length || 0}</button> 
                
                {/**This will show the comments on the post */}
                <button onClick={() => props.openPopup("comments")}>{`${props.comments.length || 0} comments`}</button> 
            </div>
            {(props.user.uid === props.author) &&
            (
            <div id="settings">
                <button onClick={() => props.openPopup("edit")}>Edit</button>
                <button onClick = {props.onDelete}>Delete</button>
            </div>)
            }
          
        </div>
    );
}