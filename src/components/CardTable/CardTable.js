import CardItem from "../CardItem/CardItem.js";
import "./CardTable.css";

export default function CardTable(props){

    
    return(
        
            <div class='center-container'>
                <div class ="{props.styleClass} expense-grid ">
                    {props.rows.map((item , index) => (
                        <CardItem 
                            key={index} 
                            name={item.name} 
                            avatar={item.avatar}
                            extraStyleClass="" /> 
                        ))}
                </div>
            </div>

      
    );
}