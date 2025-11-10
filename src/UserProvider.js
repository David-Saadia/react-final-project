import { createContext, useState, useEffect, useRef, useCallback } from "react";
import { auth } from "./firebase/FireBase";
import { onAuthStateChanged, getIdToken } from "firebase/auth";
import { removeFromListDB, searchDB } from "./firebase/ReadWriteDB";
import useHeartbeat from "./hooks/useHeartbeat";
import axiosInstance from "./axiosInstance";


export const userContext = createContext(null);


/**
 * UserProvider component that wraps its children with userContext.Provider.
 * It manages the authentication state of the user and provides a signOut 
 * function. If the user is not signed in and the current path is not the 
 * homepage, it redirects to the homepage.
 * 
 * @param {object} props - The properties passed to the UserProvider component.
 * @param {React.ReactNode} props.children - The child components to be wrapped 
 * within the userContext.Provider.
 * 
 * @returns {JSX.Element} A context provider component that supplies the current 
 * user and signOut function to its descendants.
 */


export const UserProvider = ({ children }) => {

    const refreshStaleActivityVal = useRef(null);
    
    const [user, setUser] = useState(null);
    const [tokenState, setTokenState] = useState(null);
    const [avatar, setAvatar] = useState("");
    //Ensures that the user is loaded before anything else is rendered.
    const [loading, setLoading] = useState(true); 
    
    

  const signOut = useCallback(async () => {
        //We must await removing the user from the presence list before signing them out due to firebase write rules.
        setLoading(true);
        await removeFromListDB(`/presence/`, auth.currentUser.uid);
        await auth.signOut();
        // setUser(null);
        // setTokenState(null);
        // setAccessToken(null);
        // setLoading(false);
    },[]);

    
    const fetchImage = async (fileId, setUser=true)=>{
        if(!fileId){
            console.log("fileId is null");
            return;
        } 
        try{
            const response = await axiosInstance.get(`/upload/retrieve/${fileId}`,{responseType:"blob"});
            if(response.status === 200){
                const blob = response.data;
                const url = URL.createObjectURL(blob);
                console.log("Profile picture blob: ", blob);
                console.log("Profile picture url: ", url);
                
                if(setUser){
                    setAvatar(url);
                }
                else
                    console.log("setUser is false - called by chatlist or by");
                return url;
            }
        }
        catch(err){
            console.log("Cannot fetch userPFP.");
            console.log(err);
            setAvatar("");
            
        }
    }
    
    useHeartbeat(refreshStaleActivityVal, signOut);
    
    //To avoid running on first mount, we add user to the dependecies
    useEffect(() =>{
        
        const setUserPFP = async (userObj) => {
            try{
                console.log("Attempting to set user PFP.");
                const refernceURL = `/users/${userObj.uid}/settings/avatar`;
                const picture = await searchDB(refernceURL);
                console.log("Profile picture firebase result:", picture);
                const isLocal = picture.includes("static");
                //If it's not one of the default avatar images
                if(!isLocal){
                    //This interally calls setAvatar
                    await fetchImage(picture);
                }
                else{
                    setAvatar(picture);
                }
            }
            catch(err){
                console.log(err);
                console.log("Cannot fetch userPFP.");
            }
        }
        
        const authStateListener = onAuthStateChanged(auth, async (currentUser) => {
 
            //Set user object and firebase token
            setUser(currentUser);
            if(currentUser === null){
                console.log("User signed out.");
            }
            try{
                //Force refresh token
                const idToken = await getIdToken(currentUser, true)
                setTokenState(idToken);

            }catch(err){
                //If user is null, which means they've signed out, we catch it as an error.
                console.log("error getting id token: ", err);
                setUser(null);
                setTokenState(null);
                setLoading(false);
                return;
            }
            setUserPFP(currentUser);
            setLoading(false);
            });

        return ()=> authStateListener();
 
    }, []);

  


    return (
        <userContext.Provider value={{ user, token: tokenState, loading, avatar,  signOut, refreshStaleActivityVal, fetchImage }}>
            {!loading? children :<div>Loading...</div>}
        </userContext.Provider>
    );
    

}
