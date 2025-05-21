import { useState } from "react";

import "./FormField.css";
import show from "../../../assets/images/icons/show_password_icon.png";
import hide from "../../../assets/images/icons/hide_password_icon.png";


/**
 * FormField: A base component for a form field, which includes a label and a corresponding input field.
 * The label is displayed as a tooltip when the input field is focused or has input.
 * The input field is required.
 * @param {Object} props - The properties for the FormField component.
 * @param {String} props.type - The type of the input field, e.g. "text", "password", etc.
 * @param {String} props.value - The value of the input field.
 * @param {Function} props.onChange - The callback function when the input field's value changes.
 * @param {String} props.prompt - The label for the input field.
 * @param {String} props.styleClass - Any additional CSS classes to be added to the component's root element.
 */

export default function FormField(props){
    const [showPassword , setShowPassword] = useState(false);
    const isPassword = props.type === "password";
    const hasContent = props.value && props.value.trim().length > 0;
    return(
        <div className={`form-field ${props.styleClass}`} >
            <input  name={props.type} 
                    type={isPassword && showPassword? "text" : props.type} 
                    title= {props.type} 
                    value={props.value} 
                    onChange={props.onChange} required/>
            <span className={`popup_text ${hasContent ? "has-content" : ""}`}>{props.prompt}</span>
            {isPassword && 
                <span className="toggle-password" onClick={() => setShowPassword(prev => !prev)}>
                        {showPassword ? <img src={hide} alt="hide password"/> : <img src={show} alt="show password"/>}</span>
            }
        </div>
    );
}


