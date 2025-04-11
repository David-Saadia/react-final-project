"use client";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import RegisterForm from './components/RegisterForm/RegisterForm';
import Profile from './components/Profile/Profile';
import {UserProvider} from './UserProvider';


export default function Main(){



    return (
            <UserProvider>
                <BrowserRouter basename="/react-assignment1">
                        <Routes>
                            <Route path="/" element={<Dashboard/>} />
                            <Route path="/signup" element={<RegisterForm/>} />
                            <Route path="/profile" element={<Profile/>} />
                        </Routes>
                </BrowserRouter>
            </UserProvider>
        
    );

}