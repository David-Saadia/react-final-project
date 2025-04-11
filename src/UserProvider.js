import { createContext, useState, useEffect } from "react";
import { auth } from "./components/FireBase";
import { onAuthStateChanged } from "firebase/auth";


export const userContext = createContext(null);

export const UserProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);

    useEffect(() =>{
        const unsub = onAuthStateChanged (auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser && window.location.pathname !== "/react-assignment1/") {
                window.location.href = "/react-assignment1/";
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