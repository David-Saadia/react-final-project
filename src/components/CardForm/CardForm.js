
import {useState} from "react";
import {ref, set, get} from "firebase/database";
import {auth} from "../../firebase/FireBase";
import database from "../../firebase/FireBase";

import ScreenTitle from "../base-components/ScreenTitle/ScreenTitle";
import FormField from "../base-components/FormField/FormField";
import {splitAndCapitalizeEmail} from "../../utils";
import "./CardForm.css";

export default function CardForm(props){

    const [title , setTitle] = useState("");
    //Image path is to show that image has been selected
    const [imagePath , setImagePath] = useState("");
    const [date , setDate] = useState("");
    const [image, setImage] = useState(null);

    const titleHandler = (e) => {
        setTitle(e.target.value);
    }


    const imageHandler = (e) => {
        setImagePath(e.target.value);
        const reader = new FileReader();

        try{
            reader.onload = (event) => setImage(event.target.result);
            reader.readAsDataURL(e.target.files[0]);
        }
        catch(error){
            console.log(error);
            alert("Image not selected");
            setImage(null);
            setImagePath("");
        }
    }

    const dateHandler = (e) => {
        setDate(e.target.value);
    }

    const SubmitHandler = async (e) => {
        e.preventDefault();
        console.log(title  , date);
        
        //Add new card to display cards on table
        props.addRow(title , image , date);

        //Add new actor to Firebase/user/actors
        const refernceURL = `/users/${auth.currentUser.uid}/`;
        console.log(refernceURL);
        const dbRef = ref(database, refernceURL);
        console.log(dbRef);
        const userSnapshot  = await get(dbRef);
        const currentUserName = userSnapshot.exists()? userSnapshot.val() : {name: splitAndCapitalizeEmail(auth.currentUser.email), actors: []};
        try{
            currentUserName.actors.push({ name: title, avatar: image });
            await set(dbRef, currentUserName);
        }
        catch (error){
            console.error("Error adding actor to database: ", error);
        }


    }
    return(
        <div className = "card-form-container">
            <ScreenTitle title="Add your own actor" design_id="card-form-title"/>
            <form onSubmit={SubmitHandler} className = {`${props.styleClass} `}>
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