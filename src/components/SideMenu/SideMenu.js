
import { startTransition, useContext } from "react";
import "./SideMenu.css";
import { useNavigate } from "react-router-dom";
//import { userContext } from "../../UserProvider";

export default function SideMenu(props){

    const navigation = useNavigate();
    // const {user, signOut, avatar} = useContext(userContext);

    const goTo = (path) => {
        startTransition(() => {
            navigation(path);
        });
    }

    return(<div className="docked-container" id="side-menu">
        <button className="menu-item" onClick={() => goTo('/') }>Home</button>
        <button className="menu-item" onClick={() => goTo('/profile') }>Profile</button>    
        <button className="menu-item" onClick={() => goTo('/groups') }>Groups</button>
        <button className="menu-item" onClick={() => goTo('/') }>Messages</button>
    </div>);
}