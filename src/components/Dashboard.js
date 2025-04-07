"use client";
import { useState , useEffect } from "react";
import Home from "./Home/Home";
import "./utils.css";

import LoginForm from "./LoginForm/LoginForm";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./FireBase";

function Dashboard() {
    
    const [user , setUser] = useState("");

    useEffect(() => {
        const unsub = onAuthStateChanged (auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsub
    }, []);

    const handleSignOut = async () => {
        await auth.signOut();
        setUser(null);
    };

    

    return (
        <div >
            { user ? (
                <div>
                    <Home user={user} signOut={handleSignOut} />
                </div>
            ):
             (   
                <div class="center-container">
                    <LoginForm/>
                </div>
                )
            }
        </div>
    );
}

export default Dashboard;