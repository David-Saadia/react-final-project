import { useNavigate } from 'react-router-dom';
import { useState, startTransition } from "react";
import {auth} from "../../firebase/FireBase";
import { createUserWithEmailAndPassword } from "firebase/auth";

// Context and tools
import { writeToDB, writeToListDB } from '../../firebase/ReadWriteDB';
import {splitAndCapitalizeEmail} from "../../utils";


//Compononets and styles
import ScreenTitle from "../../components/base-components/ScreenTitle/ScreenTitle";
import FormField from "../../components/base-components/FormField/FormField";
import BackgroundWrapper from '../../components/base-components/BackgroundWrapper';
import bg from"../../assets/images/Fox_in_forest_background.png";
import defaultAvatar from "../../assets/images/avatars/avatar_default.png";
import "./RegisterForm.css";
import "../../utils.css";


export default function RegisterForm() {
       
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const [passwordAuth, setPasswordAuth] = useState("");
    const navigation = useNavigate();
    
    const handleSignUp = async (e) => {
        e.preventDefault(); //prevents the page from reloading
        try {
            await createUserWithEmailAndPassword(auth, email , password);
            alert("Signed Up Successfully");
            writeToDB(`/users/${auth.currentUser.uid}/username/`,splitAndCapitalizeEmail(email)); //Add the username to the database
            writeToListDB(`/presence/`, auth.currentUser.uid);

            //More settings later...
            writeToDB(`/users/${auth.currentUser.uid}/settings/avatar/`, defaultAvatar); //Add default avatar to user's settings
            startTransition(() => navigation("/"));
        }
        catch(error) {
            alert(error.message);
            console.log(error);
        }
    }


    return (
        <BackgroundWrapper
            title="Sign up"
            backgroundImage = {bg}
            backgroundPosition = "center"
            transition="background-image 0.5s ease-in-out"
            className="center-container">
            <div className="sign-up auth-form-container">
                <ScreenTitle title="Join our ranks!"/>
                <FormField type="email" value={email} prompt="Email" onChange={(e) => setEmail(e.target.value)}/>
                <FormField type="password" value={password} prompt="Password" onChange={(e) => setPassword(e.target.value)}/>
                <FormField type="password" value={passwordAuth} prompt="Confirm Password" onChange={(e) => setPasswordAuth(e.target.value)}/>
                <input className="submit-button" onClick={handleSignUp} type="submit" value="Sign up"/>
            </div>
        </BackgroundWrapper>
    );
}