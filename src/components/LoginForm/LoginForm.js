import { useState, startTransition } from "react";
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../../firebase/FireBase";

// Context and tools
import { writeToListDB } from '../../firebase/ReadWriteDB';


//Compononets and styles
import BackgroundWrapper from "../base-components/BackgroundWrapper";
import ScreenTitle from "../base-components/ScreenTitle/ScreenTitle";
import FormField from "../base-components/FormField/FormField";
import "./LoginForm.css";
import "../../utils.css";	
import bg from"../../assets/images/Fox_in_forest_background.png";

export default function LoginForm() {
    
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const navigation = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
       
        try{
            await signInWithEmailAndPassword(auth, email , password);
            writeToListDB(`/presence/`, auth.currentUser.uid);
            alert("Signed In Successfully");
        }
        catch(error){
            alert(error.message);
            console.log(error);}
    }

    const goTo = (path) => {
        startTransition(() => {
            navigation(path);
        });
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
        </BackgroundWrapper>
    );
}