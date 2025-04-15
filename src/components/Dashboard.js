"use client";
import { useContext } from "react";
import Home from "./Home/Home";
import { userContext } from "../UserProvider";
import "./utils.css";

import LoginForm from "./LoginForm/LoginForm";


/**
 * A component that renders the main page of the application. If the user is 
 * signed in, the component renders the Home component. If the user is not 
 * signed in, the component renders the LoginForm component. The component 
 * uses the userContext to determine if the user is signed in.
 * 
 * @returns A JSX element representing the Dashboard component.
 */
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