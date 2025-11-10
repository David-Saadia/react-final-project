/** This file will act as an activity checker to ensure session activity. All time the user is active, we send
 *  a heartbeat to the server to ensure our session is still valid, and if it is then to refresh it.
 *  This will ensure that if a user is unfocused on the window, or closed the window and left the system will
 *  always log the user out and the authentication will not be persistent.*/
import { useEffect, useRef } from "react";

// Context and tools
import axiosInstance from "../axiosInstance";
import { auth } from "../firebase/FireBase";


 /**
  * Heartbeat tries to send every 5 minutes, 
  */

const HEARTBEAT_INTERVAL = 1 * 60*1000; // Every 30 mins
const ACTIVITY_TIMEOUT = 5 * 60*1000; // User must have been active in last 5 mins to send heartbeat


const useHeartbeat = (triggerRef, signOut)=> {
    const lastActive = useRef(Date.now());
    const isActive = useRef(false);

   

    useEffect( ()=>{

        let isMounted = true;
        if(triggerRef){
            //If triggerRef is null, we will set the value to this function
            triggerRef.current = ()=>{
                isActive.current = true;
                lastActive.current = Date.now();
                console.log("Refreshing stale activity token on mount..");
                console.log("Date now: ", Date.now());
                console.log(`lastActive.current = ${lastActive.current}`);
            };
        }

        const updateActivity = () =>{
            //Active if the user has been active in the last 5 minutes
            if((Date.now() - lastActive.current > ACTIVITY_TIMEOUT) && (isActive.current === false)){
                isActive.current = true;
            }
           
        }

        const sendHearbeat = async ()=> {
            const now = Date.now();
            const user = auth.currentUser;
            
            if (!user || document.visibilityState !== "visible") return;

            // Update the last active timestamp
            if(isActive.current){
                if(document.hasFocus()){
                    lastActive.current = Date.now();
                }
                isActive.current = false;
            }
            
            console.log(`now (${now}) - lastActive (${lastActive.current}) =  ${(now-lastActive.current )}`, 
            `active = ${now-lastActive.current <= ACTIVITY_TIMEOUT}`);

            console.log("Attempting to send a heartbeat...");
            console.log(`lastActive.current = ${lastActive.current}`);
            try{
                const payload = {timestamp: lastActive.current};
                const response = await axiosInstance.post("/heartbeat", payload);
                //if componet dismounted while sending heartbeat
                if (!isMounted) return;
                console.log(response.data.message);
                if (response.status===200){ 
                    //Successfull heartbeat
                    console.log("Heartbeat received successfully.");
                }
            }
            catch(err){
                //if componet dismounted while sending heartbeat
                if (!isMounted) return;
                //Session invalidated - relog
                if(err.response?.status===440){
                    console.log("Session invalidated by server..");
                    signOut();
                    alert(err.response.data.message);
                }
                console.log("Failed to send heartbeat with error - ", err);
            }
            
        }

        //This will update our last active ref when each of these events occurs
        const activityEvents = ["mousemove","keydown","mousedown","touchstart"];
        activityEvents.forEach(e => window.addEventListener(e, updateActivity)); 

        const interval = setInterval(sendHearbeat, HEARTBEAT_INTERVAL);

        updateActivity();

        //Clear up any unused listeners when we finish with the hook
        return () => {
            activityEvents.forEach(e => window.removeEventListener(e, updateActivity));
            clearInterval(interval);
            isMounted = false;
        }
    },[ signOut, triggerRef]);


     
}

export default useHeartbeat;
