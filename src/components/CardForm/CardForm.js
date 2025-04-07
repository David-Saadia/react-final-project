
import {useState} from "react";

import ScreenTitle from "../base-components/ScreenTitle/ScreenTitle";
import FormField from "../base-components/FormField/FormField";
import "./CardForm.css";

export default function CardForm(props){

    const [title , setTitle] = useState("");
    const [imagePath , setImagePath] = useState("");
    const [date , setDate] = useState("");
    const [image, setImage] = useState(null);

    const titleHandler = (e) => {
        setTitle(e.target.value);
    }


    const imageHandler = (e) => {
        setImagePath(e.target.value);
        const reader = new FileReader();
        reader.onload = (event) => setImage(event.target.result);
        reader.readAsDataURL(e.target.files[0]);
    }

    const dateHandler = (e) => {
        setDate(e.target.value);
    }

    const SubmitHandler = (e) => {
        e.preventDefault();
        console.log(title  , date);
    
        props.addRow(title , image , date);

    }
    return(
        <div className = "card-form-container">
            <ScreenTitle title="Add your own actor" design_id="card-form-title"/>
            <form onSubmit={SubmitHandler} className = {`${props.styleClass}`}>
                <div>
                    <FormField 
                        type="text"
                        prompt="New Actor" 
                        styleClass="card-form-field" 
                        value={title} 
                        onChange={titleHandler}/>
                </div>
                <div className="image-selection">
                    <label htmlFor="file-input" className="choose-file-label">{(imagePath==="")? "Choose actor image...":"Image selected."}</label>
                    <input 
                        id="file-input"
                        type="file" 
                        value={imagePath}
                        accept="image/*" 
                        onChange={imageHandler}/>
                </div>
                <div>
                    <input type="date" min="1960-01-01" max="2025-04-07"  className= "submit-button" id= "date-btn" value={date} onChange={dateHandler}/>
                </div>
                <div>
                    <button type="submit" className= "submit-button" id= "add-item-btn">Add Actor</button>
                
                </div>

            </form>
        </div>
          
        );
}