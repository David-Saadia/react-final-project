
import { useState } from "react";
import "./DropRadioButton.css";

export default function DropRadioButton(props){

    const [isOpen, setIsOpen] = useState(false);

    const selectOption = (option)=>{
        props.onChange(option);
        setIsOpen(false);
    };

    return(
        <div className="dropdown" id={props.styleId}>
            <button className="dropdown-toggle" onClick={()=>{ if(props.options.length>0) setIsOpen(!isOpen)}}>{props.value || "Select"}
            <span className={`arrow ${isOpen ? "open" : ""}`}>▾</span>
            </button>

            {isOpen && (
                <div className="dropdown-content" >
                {
                    props.options.map((option, index) =>(
                        (option!==props.value) && (
                            <button key={index} className="dropdown-item" onClick={(e)=>selectOption(option)}>{option}</button>))
                        )
                }

                </div>)
            }
        </div>
    );
}