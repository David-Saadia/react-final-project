import {useState, useEffect, useContext} from "react";

// Context and tools
import {userContext} from "../../UserProvider"
import axiosInstance from "../../axiosInstance";

import PopupModal from "../base-components/PopupModal/PopupModal";
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
    const [likes, setLikes] = useState(props.likes);
    const [postLiked, setPostLiked] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupContentType, setPopupContentType] = useState(""); // Can be popup for comments, or popup for likes.
    const postCreationTime = props.timestamp;
    const {user} = useContext(userContext);

    useEffect(()=>{
        
        const timeSincePost = () =>{
        const timePassed = Date.now() - new Date(postCreationTime);
        console.log(timePassed);

        const seconds= Math.floor(timePassed/1000);
        const minutes= Math.floor(seconds/60);
        const hours= Math.floor(minutes/60);
        const days= Math.floor(hours/24);

        if (days > 0) return (days===1)? "1 day ago" : `${days} days ago`;
        if (hours > 0) return (hours===1)? "1 hour ago" : `${hours} hours ago`;
        if (minutes > 0) return (minutes===1)? "1 minute ago" : `${minutes} minutes ago`;
        return "Just now";

    }
        setPostTime(timeSincePost());
        
    },[postCreationTime]);


    useEffect(() => {
        if (!user || !likes) return;
        setPostLiked(likes.includes(user.uid));
    }, [likes, user]);

    const unlikePost = async (e)=>{
        if(postLiked === false){
            e.target.onClick = likePost;
            return;
        }
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

    const likePost = async (e) =>{
        if(postLiked === true){
            e.target.onClick = unlikePost;
            return;
        }
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


    return(<>
    <div id="post" >
        <div id="post-header">
            <img src={props.avatar? props.avatar : defaultAvatar} alt="avatar" />
            <h2>{props.name? props.name : "Unknown User"}</h2>
            <span className="timestamp">{postTime}</span>
        </div>
        <div id="post-body">
            <p>{props.content? props.content : "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"}</p>
        </div>
        <div id="post-footer">
            <div id="likes-comments">
                {postLiked?
                <button onClick={unlikePost}>Unlike</button>:
                <button onClick={likePost}>Like</button>} {/**This wil like/unlike the post */}

                <button>{likes?.length || 0}</button> {/**This will show the number of likes abd when clicked on will show the users that have liked the post */}
                <button>Comment</button> {/**This wil add a new comment to the post */}
                <button>some-number</button> {/**This will show the comments on the post */}
            </div>
            <div id="settings">
                <button>Edit</button>
                <button onClick = {props.onDelete}>Delete</button>
            </div>
        </div>
    </div>
        </>);
};