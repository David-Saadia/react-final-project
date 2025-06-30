import './FieldArea.css'

/**
 * 
 * FormArea: A base component for a form field textarea.
 * @param {Object} props - The properties for the FormField component.
 * @param {String} [props.value] - The value of the input field.
 * @param {Function} [props.onChange] - The callback function when the input field's value changes.
 * @param {String} [props.prompt] - The label for the input field.
 * @param {String} [props.styleId] - Any additional CSS ids to be added to the component's root element.
 */
export default function FieldArea(props){

    return(<>
        <textarea
        id={props.styleId}
        className ="field-area"
        value={props.value}
        title={props.type} 
        placeholder={props.prompt} 
        onChange={props.onChange}/>
    </>);

}