import { createContext, useState, useEffect } from "react";
import { auth } from "./components/FireBase";
import { onAuthStateChanged } from "firebase/auth";


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

    useEffect(() =>{
        const unsub = onAuthStateChanged (auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser && window.location.pathname !== "/react-final-project/") {
                window.location.href = "/react-final-project/";
              }
        });

        return () => unsub
    }, []);

    const signOut = async () => {
        await auth.signOut();
        setUser(null);
    };

    return (
        <userContext.Provider value={{ user, signOut }}>
            {children}
        </userContext.Provider>
    );

}