import "./FormField.css";

export default function FormField(props){

    return(
        <div className={`form-field ${props.styleClass}`} >
            <input type={props.type} title= {props.type} value={props.value} onChange={props.onChange} required/>
            <span className="popup_text">{props.prompt}</span>
        </div>
    );
}