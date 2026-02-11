import { useState, useEffect, useRef } from "react";
import "./DropDownMenu.css";

export default function DropDownMenu(props){

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const metaData = props.optionsMetaData?.length === props.options.length ? props.optionsMetaData : null;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) 
                setIsOpen(false);
        };

        if (isOpen) document.addEventListener("mousedown", handleClickOutside);

        return () => { document.removeEventListener("mousedown", handleClickOutside); };
    }, [isOpen]);

    useEffect(() => {
        if (!props.options || props.options.length === 0) {
            setIsOpen(false);
        }
        else if(props.autoOpen && props.options && props.options.length > 0){
            setIsOpen(true);
        }
    }, [props.options, props.autoOpen]);

    // if (metaData) 
    //     console.log(metaData);

    const selectOption = (option)=>{
        // console.log("Selected option:", option);
        if(metaData && props.options.indexOf(option) !== -1) 
            props.onChange(option, metaData[props.options.indexOf(option)]);
        else
            props.onChange(option);
        setIsOpen(false);
    };

    const handleToggle = () => {
        if (props.options && props.options.length > 0) {
            setIsOpen(!isOpen);
        }
    };

    return(
        <div className="dropdown" id={props.styleId} ref={dropdownRef} >
            <div id="dropdown-menu-toggle" 
                className={`dropdown-toggle ${props.styleClass}`}  
                onClick={handleToggle}>

                    { props.children || "Select"}
            </div>
            {isOpen && (
                <div className="dropdown-content" id="dropdown-menu-content">
                {
                    ( props.isRadio && props.options.map((option, index) =>(
                        (option!==props.value) && (
                            <button key={index} id="drop-menu-item" className="dropdown-item" onClick={(e)=>selectOption(option)}>{option}</button>))
                    ))
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