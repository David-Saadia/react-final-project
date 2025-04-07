import "./ScreenTitle.css"

export default function ScreenTitle(props){
    
    return(
        <h2 class="screen-title" id={props.design_id}>{props.title}</h2>
    )
}