
import "./SideMenu.css";

export default function SideMenu(props){

    return(<div className="docked-container" id="side-menu">
        <button>Home</button>
        <button>Profile</button>
        <button>Groups</button>
        <button>Messages</button>
    </div>);
}