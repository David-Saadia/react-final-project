
import "./Field.css";



/**
 * Field: A base component for a form field.
 * @param {Object} props - The properties for the FormField component.
 * @param {String} [props.type] - The type of the input field, e.g. "text", "password", etc.
 * @param {String} [props.value] - The value of the input field.
 * @param {Function} [props.onChange] - The callback function when the input field's value changes.
 * @param {String} [props.prompt] - The label for the input field.
 * @param {String} [props.styleClass] - Any additional CSS classes to be added to the component's root element.
 * @param {String} [props.styleId] - Any additional CSS ids to be added to the component's root element.
 * @param {String} [props.inputStyle] - Any additional CSS to be added to the component's input element.
 */

export default function Field(props){

    const onKeyDown = props.onKeyDown?? null;

    return(
        <div className={`field ${props.styleClass}`} id={`${props.styleId}`} >
            <input  name={props.type} 
                    id={props.inputStyle}
                    type={props.type} 
                    title={props.type} 
                    value={props.value}
                    placeholder={props.prompt} 
                    onChange={props.onChange}
                    onKeyDown={onKeyDown}
                     />
        </div>
    );
}


