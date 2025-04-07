
import {useState} from "react";

import FormField from "../base-components/FormField/FormField";

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
        <div>
            <form onSubmit={SubmitHandler} class = {props.styleClass}>
                <div>
                    <FormField type="text" value={title} prompt="New Actor" onChange={titleHandler}/>
                </div>
                <div>
                    <label>Image</label>
                    <input 
                        type="file" 
                        value={imagePath}
                        accept="image/*" 
                        onChange={imageHandler}/>
                </div>
                <div>
                    <label>Date</label>
                    <input type="date" min="2019-01-01" max="2022-12-31" value={date} onChange={dateHandler}/>
                </div>
                <div>
                    <button type="submit">Add Expense</button>
                
                </div>

            </form>
        </div>
          
        );
}