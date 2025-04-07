import "./FormField.css";

export default function FormField(props){

    return(
        <div class="form-field">
            <input type={props.type} title= {props.type} value={props.value} onChange={props.onChange} required/>
            <span class="popup_text">{props.prompt}</span>
        </div>
    );
}