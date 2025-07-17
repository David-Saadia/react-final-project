
//**This function plays a role in throttling how many requests we send to the server (I don't wanna overload it)
// so instead of sending a request on every key stroke for example, we make sure a time clears and only then send it
// Similiary to the technique we used to throttle the heartbeats in useHeartbeat hook.
// So basically, we set a timer with a value of {delay} and we reset it every update from the user. 
// We only set the value once the timer expires, which happens when the user doesnt, keep, reseting, the timer!
// pretty efficient. */

import { useEffect, useState } from "react";


export function useDebounce(value, delay=500){
    //Sepcifiyng which value we debounch off so we can set it after user stops typing (or any other continuous event).
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(()=>{
        const timer = setTimeout( ()=>setDebouncedValue(value), delay);
        return ()=> clearTimeout(timer);
    },[value,delay]);

    return debouncedValue;
}