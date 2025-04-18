import { useNavigate } from 'react-router-dom';
import { useState, startTransition } from "react";
import {auth} from "../FireBase";
import { createUserWithEmailAndPassword } from "firebase/auth";


import ScreenTitle from "../base-components/ScreenTitle/ScreenTitle";
import FormField from "../base-components/FormField/FormField";
import "./RegisterForm.css";
import "../utils.css";

export default function RegisterForm() {
       
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const [passwordAuth, setPasswordAuth] = useState("");
    const navigation = useNavigate();
    
    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email , password);
            alert("Signed Up Successfully");
            startTransition(() => navigation("/"));
        }
        catch(error) {
            alert(error.message);
            console.log(error);
        }
    }


    return (
        <div class="center-container">
            <div class="sign-up auth-form-container">
                <ScreenTitle title="Join our ranks!"/>
                <FormField type="email" value={email} prompt="Email" onChange={(e) => setEmail(e.target.value)}/>
                <FormField type="password" value={password} prompt="Password" onChange={(e) => setPassword(e.target.value)}/>
                <FormField type="password" value={passwordAuth} prompt="Confirm Password" onChange={(e) => setPasswordAuth(e.target.value)}/>
                <input class="submit-button" onClick={handleSignUp} type="submit" value="Sign up"/>
            </div>
        </div>
    );
}