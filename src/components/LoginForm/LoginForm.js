import { useState, useContext } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../../firebase/FireBase";

// Context and tools
import { writeToListDB } from '../../firebase/ReadWriteDB';
import useGoTo from '../../hooks/useGoTo';
import { userContext } from "../../UserProvider";


//Compononets and styles

import PopupModal from "../base-components/PopupModal/PopupModal";
import { StatusWindowWrapper } from "../base-components/PopupModal/PopupModal";

import ScreenTitle from "../base-components/ScreenTitle/ScreenTitle";
import FormField from "../base-components/FormField/FormField";
import BackgroundWrapper from "../base-components/BackgroundWrapper";
import "./LoginForm.css";
import "../../utils.css";	
import bg from"../../assets/images/background-login-light.jpg";

export default function LoginForm() {
    
    const [statusMessage, setStatusMessage] = useState("");
    const [popupStatus, setPopupStatus] = useState(null);
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const {refreshStaleActivityVal} = useContext(userContext);

    const goTo = useGoTo();

    const handleSignIn = async (e) => {
        e.preventDefault();
       
        try{
            await signInWithEmailAndPassword(auth, email , password);
            if (refreshStaleActivityVal.current){
                refreshStaleActivityVal.current();
            } 
            else{
                console.log("No refreshStalActiviyFunction found.");
            }
            writeToListDB(`/presence/`, auth.currentUser.uid);

        }
        catch(error){
            setStatusMessage(error.message.split("(")[1].split(")")[0]);
            setPopupStatus("error");
            //alert(error.message);
            console.log(error);}
    }



    return (
        <BackgroundWrapper
            title="Login"
            backgroundImage = {bg}
            backgroundPosition = "center"
            transition="background-image 0.5s ease-in-out"
            className="center-container">
                
            <div className="login auth-form-container">
                <ScreenTitle title="Login"/>
                <FormField type="email" value={email} prompt="Email" onChange={(e) => setEmail(e.target.value)}/>
                <FormField type="password" value={password} prompt="Password" onChange={(e) => setPassword(e.target.value)}/>
                <input className="submit-button" onClick={handleSignIn} type="submit" value="Sign in"/>
                <div className="links-group">
                    <button onClick={() => goTo("/")}>Forgot Password</button>
                    <button onClick={() => goTo("/signup")}>Sign Up</button>
                </div>
            </div>
            <PopupModal isOpen={!!statusMessage} onClose={() => setStatusMessage("")}>
                <StatusWindowWrapper 
                    statusType={popupStatus}
                    message={statusMessage} 
                    onClose={() => {setPopupStatus(null); setStatusMessage("");}}/>
            </PopupModal>
        </BackgroundWrapper>
    );
}