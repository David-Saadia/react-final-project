/** This file will act as an activity checker to ensure session activity. All time the user is active, we send
 *  a heartbeat to the server to ensure our session is still valid, and if it is then to refresh it.
 *  This will ensure that if a user is unfocused on the window, or closed the window and left the system will
 *  always log the user out and the authentication will not be persistent.*/
import { useContext, useEffect, useRef } from "react";

// Context and tools
import axiosInstance from "../axiosInstance";
import { auth } from "../firebase/FireBase";
import { removeFromListDB } from "../firebase/ReadWriteDB";

 

const HEARTBEAT_INTERVAL = 30 * 60*1000; // Every 30 mins
const ACTIVITY_TIMEOUT = 5 * 60*1000; // User must have been active in last 5 mins to send heartbeat

const useHearbeat = (triggerRef, setUser, setToken)=> {
    const lastActive = useRef(Date.now());
    const lastHeartbeat = useRef(0);
    const isActive = useRef(false);

    if (triggerRef){
        triggerRef.current = ()=>{
            isActive.current = true;
            lastActive.current = Date.now();
            console.log("Refreshing stale activity token on mount..");
        };
    }
    
    useEffect( ()=>{

        const updateActivity = () =>{
            //Active if the user has been active in the last 5 minutes
            if((Date.now()- lastActive.current > ACTIVITY_TIMEOUT) && (isActive.current === false)){
                isActive.current = true;
            }
           
        }

        const sendHearbeat = async ()=> {
            const now = Date.now();
            const user = auth.currentUser;
            if (!user) return;
            if(isActive.current){
                if(document.hasFocus()){
                    lastActive.current = Date.now();
                }
                isActive.current = false;
            }
            
            console.log(`now (${now}) - lastActive (${lastActive.current}) =  ${(now-lastActive.current )}`, 
            `value = ${now-lastActive.current <= ACTIVITY_TIMEOUT}`);
            const HeartbeatReady = now-lastHeartbeat.current >= HEARTBEAT_INTERVAL;

            if(HeartbeatReady){

                 console.log("Attempting to send a heartbeat...");
                 console.log(`lastActive.current = ${lastActive.current}`);
                try{
                    
                    const payload = {timestamp: lastActive.current};
                    const response = await axiosInstance.post("/heartbeat", payload);
                    console.log(response.data.message);
                    if (response.status===200){ //Successfull heartbeat
                        lastHeartbeat.current = now;
                    }
                }
                catch(err){
                    if(err.response?.status===440){//Session invalidated - relog
                        alert(err.response.data.message);
                        await removeFromListDB(`/presence/`, auth.currentUser.uid);
                        await auth.signOut();
                        setUser(null);
                        setToken(null);
                        console.log("Session exired...");
                        return;
                    }
                    console.log("Failed to send heartbeat with error - ", err);
                }
            }
            else{
                console.log("Skipping heartbeat - Heartbeat not ready...");
            }
        }

        //This will update our last active ref when each of these events occurs
        const activityEvents = ["mousemove","keydown","mousedown","touchstart"];
        activityEvents.forEach(e => window.addEventListener(e, ()=>updateActivity(false))   ); 

        const interval = setInterval(sendHearbeat, 5 * 60*1000);

        updateActivity(true);

        //Clear up any unused listeners when we finish with the hook
        return () => {
            activityEvents.forEach(e => window.removeEventListener(e, updateActivity));
            clearInterval(interval);
        }
    },[]);


     
}

export default useHearbeat;
