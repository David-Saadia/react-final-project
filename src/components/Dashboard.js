"use client";
import { useContext } from "react";
import Home from "./Home/Home";
import { userContext } from "../UserProvider";
import "./utils.css";

import LoginForm from "./LoginForm/LoginForm";


function Dashboard() {

    const { user } = useContext(userContext);

    return (
        <div >
            { user ? (
                <div>
                    <Home/>
                </div>
            ):
             (   
                <div className="center-container">
                    <LoginForm/>
                </div>
                )
            }
        </div>
    );
}

export default Dashboard;