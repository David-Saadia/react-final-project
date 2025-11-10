import { useNavigate } from 'react-router-dom';
import { useContext, startTransition  } from 'react';


// Context and tools
import { userContext } from "../../../UserProvider";


// Compononets and styles
import logo from "../../../assets/images/logo.png";
import SearchBar from '../../SearchBar/SearchBar'; 
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
    console.log("avatar: ", avatar);
    const navigation = useNavigate();


    const goTo = (path) => {
        startTransition(() => {
            navigation(path);
        });
    }

    

    return(

        <div className="docked-container" id="navigation-docker">
                        <img onClick={() => goTo("/")} id ="logo" alt="logo" src={logo}/>
                        <div id = "home-search">
                            <button className="nav-button" onClick={() => goTo("/")} id="home-button"></button>
                            <SearchBar type="posts" inputStyleAdditions='search-input'/>
                        </div>
                        <menu id ="settings-menu">
                            <button className="nav-button" id="settings-button" onClick={() => goTo("/settings")} aria-label="Settings"/>
                            <img id="profile-picture" alt="pfp" src={avatar===""? "https://cdn-icons-png.flaticon.com/512/149/149071.png":avatar} title="My Avatar"/>
                            <button className="nav-button" id="log-out-button" onClick={signOut} aria-label="Sign Out"></button>

                        </menu>
                        
            <span id="menu-backgroundEffect"></span>        
        </div>
        

    );
}