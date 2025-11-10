
import "./ToggleSlider.css";


export default function ToggleSlider(props){

    return(  
    <label htmlFor={props.buttonId} className={`slider-label ${props.labelClass}`}>
        <span>{props.sliderText}</span>
        <input id={props.buttonId} className={`check-box ${props.btnClass}`} name={props.name} title={props.name} type="checkbox" onChange={()=>props.onChange()}/>
        <div className="slider"></div>
    </label>
    );
}