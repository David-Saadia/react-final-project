
import "./CardItem.css"

export default function CardItem(props){


    return(
        <div className="card-item {props.extraStyleClass}" >
            <img 
            src={props.avatar} 
            alt={props.name}
            />   
            <span>{props.name}</span>        
        </div>
    );
}