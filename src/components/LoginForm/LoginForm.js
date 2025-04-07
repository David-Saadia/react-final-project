import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import {auth} from "../FireBase";
import { signInWithEmailAndPassword } from "firebase/auth";

import ScreenTitle from "../base-components/ScreenTitle/ScreenTitle";
import FormField from "../base-components/FormField/FormField";
import "./LoginForm.css";
import "../utils.css";	
import bg from"../../assets/images/Fox_in_forest_background.png";

export default function LoginForm() {

    useEffect(() => {
        document.title = "Login";
        document.body.style.backgroundImage = `url(${bg})`; ;
        document.body.style.backroundSize= "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";
        
    }, []);
    
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");

    const handleSignIn = async (e) => {
        e.preventDefault();
        try{
            await signInWithEmailAndPassword(auth, email , password);
            alert("Signed In Successfully");
        }
        catch(error){
            alert(error.message);
    }
    }

    return (
        <div class="login auth-form-container">
            <ScreenTitle title="Login"/>
            <FormField type="email" value={email} prompt="Email" onChange={(e) => setEmail(e.target.value)}/>
            <FormField type="password" value={password} prompt="Password" onChange={(e) => setPassword(e.target.value)}/>
            <input class="submit-button" onClick={handleSignIn} type="submit" value="Sign in"/>
            <div class="links-group">
                <Link to="/">Forgot Password</Link>
                <Link to="/signup">Sign Up</Link>
            </div>
        </div>
    );
}