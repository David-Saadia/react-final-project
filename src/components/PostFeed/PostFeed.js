import { useState, useEffect, useContext } from "react";


// Context and tools
import {userContext} from "../../UserProvider";
import axiosInstance from "../../axiosInstance";
import { findUserNameDB } from "../../firebase/ReadWriteDB";
import '../../utils.css';

//Compononets and styles
import Post from "../Post/Post"
import FieldArea from "../base-components/FieldArea/FieldArea"
import './PostFeed.css';


export default function PostFeed(props){
    
    const [posts, setPosts] = useState([]);
    const [newPostText, setNewPostText] = useState("");
    const [loading, setLoading] = useState(true);
    const {user} = useContext(userContext);

    useEffect( () => {
        //Fetch the posts from the backend
        fetchPosts();

    }, [loading]);

     const fetchPosts = async () =>{
            try{
                const response = await axiosInstance.get('/posts/?limit=100');
                console.log(response.data.message);
                
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

    const createNewPost = async () =>{
        
        console.log("Attempting to create a new post..");
        
        console.log(newPostText);
        
        const newPost = {
            author:user.uid,
            content:newPostText
        };
        try{
            const response = await axiosInstance.post("/posts", newPost);
            if (response.status===201){
                const {post:returnedPost, message} = response.data;
                console.log(message, returnedPost);
                const userName = await findUserNameDB(returnedPost.author);
                const addedPost = {...returnedPost,userName }
                setNewPostText("");
                setPosts((prev)=> [...prev, addedPost]);
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
                <button 
                    className="submit-button"
                    id="submit-post-button"
                    onClick={createNewPost}>Post</button>
            </div>
            <div id="posts">
                {posts.length===0 && <>No Posts Available :( Perhaps you can add something new?</>}

                {!loading && Array.isArray(posts) && posts.map((postItem, postIndex)=>(
                    <Post 
                        postID={postItem._id}
                        name={postItem.userName}
                        content={postItem.content}
                        timestamp={postItem.timestamp}
                        likes={postItem.likes}
                        comments={postItem.comments}
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