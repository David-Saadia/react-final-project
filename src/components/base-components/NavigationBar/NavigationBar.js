import { Link } from 'react-router-dom';
import { useContext } from 'react';


import { splitAndCapitalizeEmail } from "../../utils";
import ScreenTitle from "../ScreenTitle/ScreenTitle";
import { userContext } from "../../../UserProvider";

import "./NavigationBar.css";


/**
 * A NavigationBar component that renders a menu with options for the 
 * main pages of the application. The component uses the userContext 
 * to determine if the user is signed in and if so, displays the user's 
 * name and a log out button. The component also takes a currentPage 
 * prop which determines which menu item is active.
 * 
 * @param {object} props - An object containing the currentPage prop.
 * @param {string} props.currentPage - The current page of the application.
 * 
 * @returns A JSX element representing the NavigationBar component.
 */
export default function NavigationBar(props) {

    const {user, signOut} = useContext(userContext);


    return(
        <div className="docked-container welcome-docker">
                        <ScreenTitle design_id="welcome-title" title={user? `Welcome ${splitAndCapitalizeEmail(user.email)}`:`Welcome Guest`}/>
                        <button className="log-out-button" onClick={signOut} aria-label="Sign Out"></button>
                        <menu className="menu-container">
                            <Link to="/" className={`menu-item ${props.currentPage === "home"? "active" : ""}`}>Home</Link>
                            <Link to="/profile" className={`menu-item ${props.currentPage === "profile"? "active" : ""}`} >Profile</Link>
                        </menu>
                     
        </div>
        

    )
}