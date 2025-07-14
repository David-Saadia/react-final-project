import { useState } from "react";
import "./DropDownMenu.css";

export default function DropDownMenu(props){

    const [isOpen, setIsOpen] = useState(false);

    const selectOption = (option)=>{
        props.onChange(option);
        setIsOpen(false);
    };

    return(
        <div className="dropdown" id={props.styleId}>
            <div id="dropdown-menu-toggle" className="dropdown-toggle"  onClick={()=>setIsOpen(!isOpen)}>{ props.children || "Select"}</div>
            {isOpen && (
                <div className="dropdown-content" id="dropdown-menu-content">
                {
                    props.isRadio &&props.options.map((option, index) =>(
                        (option!==props.value) && (
                            <button key={index} id="drop-menu-item" className="dropdown-item" onClick={(e)=>selectOption(option)}>{option}</button>))
                        ) 
                        ||
                        //This SHOULD make it where if the button is not radio, it will just show the options
                    props.options.map((option, index) =>(
                            <button key={index} id="drop-menu-item" className="dropdown-item" onClick={(e)=>selectOption(option)}>{option}</button>)
                        )
                    
                }

                </div>)
            }
        </div>
        
    );
}