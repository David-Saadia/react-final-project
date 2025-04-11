import { Link } from 'react-router-dom';
import { useContext } from 'react';


import { splitAndCapitalizeEmail } from "../../utils";
import ScreenTitle from "../ScreenTitle/ScreenTitle";
import { userContext } from "../../../UserProvider";

import "./NavigationBar.css";

export default function NavigationBar(props) {

    const {user, signOut} = useContext(userContext);


    return(
        <div className="docked-container welcome-docker">
                        <ScreenTitle design_id="welcome-title" title={user? `Welcome ${splitAndCapitalizeEmail(user.email)}`:`Welcome Guest`}/>
                        <button className="log-out-button" onClick={signOut} aria-label="Sign Out"></button>
                        {/* <menu className="menu-container">
                            <Link to="/" className="menu-item">Home</Link>
                            <Link to="/profile" className="menu-item" >Profile</Link>
                        </menu> */}
                     
        </div>
        

    )
}