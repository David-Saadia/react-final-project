
//**This componet will be used to verify user's authentication and redirect
// the user to the home page if authentication expires, instead of implementing this 
// redirection logic in every component, we'll just include this hook in every page component */

import { startTransition, useContext, useEffect } from "react";
import { userContext } from "../UserProvider";
import { useNavigate, useLocation } from "react-router-dom";


export function useRequireAuth(){
    
    const {user, loading} = useContext(userContext);
    
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(()=>{   
        const goto = (path, options={}) => {
            startTransition(() => {
                navigate(path, options);
            });
        };

        if(location === "/")
            return;

        if (location === "/home" && !user)
            goto("/login");

        if(loading && !user)
            console.log("User authentication is loading...");

        if(!loading && !user){
            console.log("User is not logged in. Redirecting to login page...");
            goto("/");
        }
            
    },[user,loading, location, navigate]);
}