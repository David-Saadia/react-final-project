import { createContext, useState, useEffect } from "react";
import { auth } from "./firebase/FireBase";
import { onAuthStateChanged } from "firebase/auth";
import { removeFromListDB } from "./firebase/ReadWriteDB";


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
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); //Ensures that the user is loaded before anything else is rendered.
    // const [token, setToken] = useState(null);

    useEffect(() =>{
        const unsub = onAuthStateChanged (auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            // currentUser?.getIdToken().then((token) => { //If the user is signed in, get their token
            //     setToken(token);
            // });
            
        });

        return () => unsub
    }, []);

    const signOut = async () => {
        //We must await removing the user from the presence list before signing them out due to firebase write rules.
        await removeFromListDB(`/presence/`, auth.currentUser.uid);
        await auth.signOut();
        setUser(null);
    };


    return (
        <userContext.Provider value={{ user, loading,  signOut }}>
            {!loading? children :<div>Loading...</div>}
        </userContext.Provider>
    );

}