import ReactDOM from "react-dom";
import {useEffect} from "react";

import "./PopupModal.css"
/**
 * 
 * @param {object} props - To hold all arguments.
 * @param { function } props.onClose - onClose function to execute when the X button is clicked (or we try to close the window)
 * @param { boolean } props.isOpen - Boolean value to determine if the popup is open or not. 
 * @param { any } props.children - children to wrap with this component - content of the popup window.
 * @returns {JSX.PopupModal} 
 */
export default function PopupModal(props){
    
    //This prevents background scrolling.
    useEffect(()=> {
    if (props.isOpen) document.body.classList.add("modal-open");
    else document.body.classList.remove("modal-open");
    return () => document.body.classList.remove("modal-open");
    },[props.isOpen]);

    if(!props.isOpen) return null;


    //This portal basically allows nesting this component in other components but still having
    // it have the document.body constraits and not the parents constraits, so we can fill the entire screen.
    return ReactDOM.createPortal(
             <div id="popup-backdrop" onClick={props.onClose}>
            <div id="popup-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={props.onClose}>X</button>
                {props.children}
            </div>
        </div>,
        document.body
    );
      
}