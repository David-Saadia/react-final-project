
//**This componet will be used to verify user's authentication and redirect
// the user to the home page if authentication expires, instead of implementing this 
// redirection logic in every component, we'll just include this hook in every page component */

import { useContext, useEffect } from "react";
import { userContext } from "../UserProvider";
import { useLocation } from "react-router-dom";
import useGoTo from "./useGoTo";


export function useRequireAuth(){
    
    const {user, loading} = useContext(userContext);
    
    const goTo = useGoTo();
    const location = useLocation();
    
    useEffect(()=>{   

        if(location === "/")
            return;

        if (location === "/home" && !user)
            goTo("/login");

        if(loading && !user)
            console.log("User authentication is loading...");

        if(!loading && !user){
            console.log("User is not logged in. Redirecting to login page...");
            goTo("/");
        }
            
    },[user,loading, location, goTo]);
}