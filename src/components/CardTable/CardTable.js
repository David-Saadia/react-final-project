import CardItem from "../CardItem/CardItem.js";
import ScreenTitle from "../base-components/ScreenTitle/ScreenTitle";
import "./CardTable.css";

export default function CardTable(props){

    
    return(
        <div>
            <ScreenTitle title={props.tableTitle}/>
            <div className='center-container'>
                
                <div className ="{props.styleClass} expense-grid ">
                    {props.rows? props.rows.map((item , index) => (
                        <CardItem 
                            key={index} 
                            name={item.name} 
                            avatar={item.avatar}
                            extraStyleClass="" /> 
                        )): <></>}
                </div>
            </div>

        </div>

      
    );
}