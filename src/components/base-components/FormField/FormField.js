import "./FormField.css";


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

    return(
        <div className={`form-field ${props.styleClass}`} >
            <input name={props.type} type={props.type} title= {props.type} value={props.value} onChange={props.onChange} required/>
            <span className="popup_text">{props.prompt}</span>
        </div>
    );
}