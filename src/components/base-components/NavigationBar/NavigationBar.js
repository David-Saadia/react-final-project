import { useNavigate } from 'react-router-dom';
import { useContext, startTransition  } from 'react';


// Context and tools
import { userContext } from "../../../UserProvider";


// Compononets and styles
import logo from "../../../assets/images/logo.png";
import Field from "../Field/Field";
import "./NavigationBar.css";



/**
 * The NavigationBar component renders a docked navigation bar at the top of the page.
 * The NavigationBar contains the app's logo, a search bar, a settings menu, and a button to sign out.
 * The NavigationBar is rendered on every page, and links to the home page.
 * The NavigationBar also displays the user's status and profile picture.
 * @function
 * @returns {ReactElement} - The rendered NavigationBar component.
 */
export default function NavigationBar() {

    const {signOut, avatar} = useContext(userContext);
    const navigation = useNavigate();


    const goTo = (path) => {
        startTransition(() => {
            navigation(path);
        });
    }

    

    return(

        <div className="docked-container" id="navigation-docker">
                        <img id ="logo" alt="logo" src={logo}/>
                        <div id = "home-search">
                            <button onClick={() => goTo("/")} id="home-button"></button>
                            <Field type="text" prompt="Search..." styleClass="search-bar" styleId="nav-search"/>
                        </div>
                        <menu id ="settings-menu">
                            <button id="settings-button" onClick={signOut} aria-label="Settings"/>
                            <button id="notifications-button" onClick={signOut} aria-label="Notifications"/>
                            <img id="profile-picture" alt="pfp" src={avatar}/>
                            <button id="log-out-button" onClick={signOut} aria-label="Sign Out"></button>

                        </menu>
                        
            <span id="menu-backgroundEffect"></span>        
        </div>
        

    );
}