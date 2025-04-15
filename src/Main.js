"use client";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import RegisterForm from './components/RegisterForm/RegisterForm';
import Profile from './components/Profile/Profile';
import {UserProvider} from './UserProvider';


/**
 * The main function of the app. It wraps the entire app in UserProvider 
 * and BrowserRouter and sets the basename to "/react-assignment1". 
 * It defines three routes: "/" that renders Dashboard, "/signup" that renders
 * RegisterForm, and "/profile" that renders Profile.
 */
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