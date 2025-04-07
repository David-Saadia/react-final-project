"use client";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import RegisterForm from './components/RegisterForm/RegisterForm';


export default function Main(){

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard/>} />
                <Route path="/signup" element={<RegisterForm/>} />
            </Routes>
        </BrowserRouter>
    );

}