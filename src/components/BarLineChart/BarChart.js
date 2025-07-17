import {BarChart, Bar, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';

import "./Charts.css"


export const BarGraph = (props)=> {
    
    return(
        <div className="chart-container">
            <h3>{props.title || "Bar Chart"}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={props.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>

        </div>
    );
}


export const LineGraph = (props) => {
    
    return(
        <div className="chart-container"> 
            <h3>{props.title || "Line Chart"}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={props.data} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3" /> 
                    <XAxis dataKey="name" /> 
                    <YAxis /> 
                    <Tooltip /> 
                    <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} dot={true} animationDuration={500} /> 
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
