
import { startTransition } from "react";
import "./SideMenu.css";
import { useNavigate } from "react-router-dom";

export default function SideMenu(props){

    const navigation = useNavigate();

    const goTo = (path) => {
        startTransition(() => {
            navigation(path);
        });
    }

    return(<div className="docked-container" id="side-menu">
        <button className="menu-item" onClick={() => goTo('/') }>Home</button>
        <button className="menu-item" onClick={() => goTo('/profile') }>Profile</button>    
        <button className="menu-item" onClick={() => goTo('/groups') }>Groups</button>
        <button className="menu-item" onClick={() => goTo('/chats') }>Messages</button>
    </div>);
}