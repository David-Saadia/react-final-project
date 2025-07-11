import "./ScreenTitle.css"

/**
 * A functional component that displays a screen title.
 * 
 * @param {object} props - The props object.
 * @param {string} props.title - The text to display as the screen title.
 * @param {string} props.designId - The id to assign to the title element.
 * @param {string} props.designClass - The id to assign to the title element.
 * 
 * @returns A JSX element representing the screen title.
 */

export default function ScreenTitle(props){
    
    return(
        <h2 className={`screen-title ${props.designClass}`} id={props.designId}>{props.title}</h2>
    )
}