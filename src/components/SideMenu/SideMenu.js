
import useGoTo from "../../hooks/useGoTo";
import "./SideMenu.css";

export default function SideMenu(props){

    const goTo = useGoTo();

    return(<div className="docked-container" id="side-menu">
        <button className="menu-item" onClick={() => goTo('/') }>Home</button>
        <button className="menu-item" onClick={() => goTo('/profile') }>Profile</button>    
        <button className="menu-item" onClick={() => goTo('/groups') }>Groups</button>
        <button className="menu-item" onClick={() => goTo('/chat') }>Messages</button>
    </div>);
}