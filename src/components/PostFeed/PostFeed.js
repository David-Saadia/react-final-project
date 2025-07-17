import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";


// Context and tools
import {userContext} from "../../UserProvider";
import axiosInstance from "../../axiosInstance";
import { findUserNameDB } from "../../firebase/ReadWriteDB";
import '../../utils.css';

//Compononets and styles
import Post from "../Post/Post"
import FieldArea from "../base-components/FieldArea/FieldArea"
import DropRadioButton from "../base-components/DropRadioButton/DropRadioButton";
import ImageSelector from "../base-components/ImageSelector/ImageSelector";
import './PostFeed.css';



export default function PostFeed(props){
    
    const [posts, setPosts] = useState([]);
    const [newPostText, setNewPostText] = useState("");
    const [newPostImage, setNewPostImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [groupAttached, setGroupAttached] = useState("None");
    const [userGroups, setUserGroups] = useState([]);
    const {user} = useContext(userContext);
    const {groupId} = useParams();
    const type = props.type;


    useEffect( () => {
        //Fetch the posts from the backend
        if(!user) return;

         const fetchPosts = async () =>{
            try{
                if(type==="results")
                    return;
                
                let path = "/posts/?limit=100";
                path += (type==="profile")? `&userId=${user?.uid}`: "";
                path = (type!=="group")? path : `/groups/posts/${groupId}?limit=100`;
                console.log( `path= ${path}`);
                const response = await axiosInstance.get(path);
                // DEBUG: console.log(response.data.message);
                
                if (response.status===200){
                    const fetchedPosts = await Promise.all(
                        response.data.posts.map(async (post)=>{
                            const userName = await findUserNameDB(post.author);
                            //console.log(`Debugging fetched posts.. author=${userName} \nPost properties=${post}`);
                            return {...post, userName};
                        })
                    );
                    
                    setPosts(fetchedPosts);
                    setLoading(false);
                }
            }
            catch(err){
                console.log(err);
                console.log(`${err.response?.data?.message} cause: ${err.response?.data?.error}`)
            }

        }

        const fetchUserGroups = async () =>{
            const limit = 20;
            try{
                const response = await axiosInstance.get(`/groups/?userId=${user?.uid}&limit=${limit}`);
                if (response.status===200){
                    setUserGroups(response.data.groups);
                    //DEBUG:console.log(response.data.groups);
                    console.log(response.data.message);
                }
            }
            catch(err){
                console.log(err);
                console.log(err.response?.data?.message);
            }
        }

        fetchPosts();
        fetchUserGroups();

    }, [loading, type, user, groupId]);

    useEffect(() => {

        const fetchResultsUsernames = async () =>{
            if(type!=="results" || !props.results || props.results.length===0) return;

        const results = await Promise.all(
            props.results.map(async (post)=>{
                const userName = await findUserNameDB(post.author);
                return {...post, userName};
            })
        );
        console.log("Using the results I got from my props");
        console.log(props.results);
        setPosts(results);
        setLoading(false);  
        }

        fetchResultsUsernames();
        
    },[type, props.results]);



    
    const createNewPost = async () =>{
        
        console.log("Attempting to create a new post..");
        let attachment = null;
        if(newPostImage){
            try{
                console.log("Attempting to upload image to attach to post..");
                //For multer on the serverside to parse this request correctly, we must package the image with FormDate object
                const formData = new FormData();
                formData.append("image", newPostImage);
                formData.append("filePath" ,"/posts")
                const response = await axiosInstance.post("/upload/image", formData);
                if (response.status===201){
                    console.log(response.data.message);
                    attachment = response.data.file;
                }
            }catch(err){
                console.log(err);
                console.log(err.response?.data?.message);
                return;
            }
        }
        
        console.log(newPostText);
        const newPost = {
            author:user.uid,
            content:newPostText,
        };
        if(attachment)
            newPost.attachment = attachment;

        if(groupAttached!=="None")
            newPost.group = userGroups.find((group)=>group.name===groupAttached)._id; 
        console.log(`new post group = ${newPost.group}`);
        try{
            const response = await axiosInstance.post("/posts", newPost);
            if (response.status===201){
                const {post:returnedPost, message} = response.data;
                console.log(message, returnedPost);
                const userName = await findUserNameDB(returnedPost.author);
                const addedPost = {...returnedPost,userName }
                setNewPostText("");
                if(newPost.group === groupId || type!=="group")
                    setPosts((prev)=> [addedPost , ...prev]);
            } 

        }catch(err){
            console.log(`${err.response?.data?.message} cause: ${err.response.error}`);
        }
        
    }

    const deletePost = async (postId) =>{
        try{
            const response = await axiosInstance.delete(`/posts/${postId}`);
            if (response.status===200){
                console.log(response.data.message);
                return true;
            }
        }catch(err){
            console.log(err);
            console.log(err.response?.data?.message);
        }
        return false;
    }

    return(
        <div className="center-container" id="post-feed" >
            <div id= "new-post-form">
                <FieldArea 
                prompt="What's on your mind?" 
                styleId="new-post-field" value={newPostText} 
                onChange={(e)=>setNewPostText(e.target.value)}/>
                <div className="post-selectors">
                    <DropRadioButton
                        styleId="post-group-selector"
                        options={["None", ...userGroups.map((group)=>group.name)]}
                        value={groupAttached}
                        onChange={setGroupAttached}
                        />
                    <ImageSelector onSelectImage={(image)=>setNewPostImage(image)}/>
                </div>
                <button 
                    className="submit-button"
                    id="submit-post-button"
                    onClick={createNewPost}>Post</button>
            </div>
            <div id="posts">
                {posts.length===0 && <>No Posts Available :( Perhaps you can add something new?</>}
                
                {/* DEBUG: {console.log(posts)} */}
                {!loading && Array.isArray(posts) && posts.map((postItem, postIndex)=>(
                    <Post 
                        key ={postItem._id}
                        postID={postItem._id}
                        author={postItem.author}
                        name={postItem.userName}
                        content={postItem.content}
                        timestamp={postItem.timestamp}
                        likes={postItem.likes}
                        comments={postItem.comments}
                        attachment={postItem.attachment}
                        onDelete = {async (e)=>{
                            const success = await deletePost(postItem._id);
                            if(success){
                                setPosts((prevPosts)=> prevPosts.filter(p=> p._id !== postItem._id));   
                            }
                        }}
                    />
                ))}
            </div>
        </div>
    );
};