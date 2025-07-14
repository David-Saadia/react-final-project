import { createContext, useState, useEffect, useRef } from "react";
import { auth } from "./firebase/FireBase";
import { onAuthStateChanged, getIdToken } from "firebase/auth";
import { removeFromListDB, searchDB } from "./firebase/ReadWriteDB";
import useHearbeat from "./hooks/useHeartbeat";



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
    const [token, setToken] = useState(null);
    const [avatar, setAvatar] = useState("");
    const [loading, setLoading] = useState(true); //Ensures that the user is loaded before anything else is rendered.
    
    useHearbeat(refreshStaleActivityVal, setUser, setToken);

    useEffect(() =>{
        
        const unsub = onAuthStateChanged (auth, async (currentUser) => {
            setUser(currentUser);
            const fireBaseToken = currentUser? await getIdToken(currentUser, true) : null;
            setToken(fireBaseToken);
            setLoading(false);
            if(currentUser && currentUser.uid) {
                fetchUserPFP(currentUser);}
            else setAvatar("");
        });

        return () => unsub();
    }, []);

    const signOut = async () => {
        //We must await removing the user from the presence list before signing them out due to firebase write rules.
        await removeFromListDB(`/presence/`, auth.currentUser.uid);
        await auth.signOut();
        setUser(null);
        setToken(null);
    };


     const fetchUserPFP = async (userObj) => {
            
            try{
                //console.trace("fetchUserPFP called with:", userObj);
                //console.log("userObj = " ,userObj);
                if (!userObj || typeof userObj !== "object" || !userObj.uid){
                    //console.warn("fetchUserPFP called with invalid userObj:", userObj);
                    return;
                }
            
                const refernceURL = `/users/${userObj.uid}/settings/avatar`;
                const results = userObj.uid? await searchDB(refernceURL): null;
                // DEBUG: console.log("The results are", results);
                setAvatar(results);
            }
            catch(err){
                console.log(err);
                console.log("Cannot fetch userPFP.");
            }
        }
  


    return (
        <userContext.Provider value={{ user, token, loading, avatar,  signOut, refreshStaleActivityVal }}>
            {!loading? children :<div>Loading...</div>}
        </userContext.Provider>
    );

}