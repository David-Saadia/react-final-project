
//**This componet will be used to verify user's authentication and redirect
// the user to the home page if authentication expires, instead of implementing this 
// redirection logic in every component, we'll just include this hook in every page component */

import { startTransition, useContext, useEffect, useState } from "react";
import { userContext } from "../UserProvider";
import { useNavigate } from "react-router-dom";


export function useRequireAuth(){
    const {user, loading} = useContext(userContext);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    
    const navigate = useNavigate();
    
    useEffect(()=>{   
        const goto = (path, options={}) => {
            startTransition(() => {
                navigate(path, options);
            });
        };

        if(loading) return <div>Loading...</div>;
    
        if(user)
            setIsAuthenticated(true);
        if(!isAuthenticated && !loading) 
            console.log("User is not authenticated, redirecting...");
        if(!loading && !user)
            goto("/");
            
    },[user,loading, navigate, isAuthenticated]);
}