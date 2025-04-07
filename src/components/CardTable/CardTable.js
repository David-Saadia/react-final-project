import CardItem from "../CardItem/CardItem.js";
import "./CardTable.css";

export default function CardTable(props){

    
    return(
        
            <div className='center-container'>
                <div className ="{props.styleClass} expense-grid ">
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