
import { useState } from "react";
import "./ImageSelector.css";

export default function ImageSelector(props){

    const [imagePath , setImagePath] = useState("");
    const {onSelectImage} = props;
 

    const imageHandler = (e) => {
        setImagePath(e.target.value);
        onSelectImage(e.target.files[0]);

    }

    return (
         <div className="image-selection">
            <label htmlFor="file-input" className="choose-file-label">{(imagePath==="")? "Choose Image":"Image selected."}</label>
            <input 
                id="file-input"
                type="file" 
                value={imagePath}
                accept="image/*" 
                onChange={imageHandler}/>
        </div>
    );
}