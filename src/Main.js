"use client";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {lazy} from 'react';
import {UserProvider} from './UserProvider';
// import Dashboard from './components/Dashboard';
// import RegisterForm from './components/RegisterForm/RegisterForm';
// import Profile from './components/Profile/Profile';
const Profile = lazy(() => import('./components/Profile/Profile'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const RegisterForm = lazy(() => import('./components/RegisterForm/RegisterForm'));


/**
 * The main function of the app. It wraps the entire app in UserProvider 
 * and BrowserRouter and sets the basename to "/react-assignment1". 
 * It defines three routes: "/" that renders Dashboard, "/signup" that renders
 * RegisterForm, and "/profile" that renders Profile.
 */
export default function Main(){



    return (
            <UserProvider>
                <BrowserRouter basename={process.env.PUBLIC_URL}>
                        <Routes>
                            <Route path="/" element={<Dashboard/>} />
                            <Route path="/signup" element={<RegisterForm/>} />
                            <Route path="/profile" element={<Profile/>} />
                        </Routes>
                </BrowserRouter>
            </UserProvider>
        
    );

}