"use client";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {lazy, Suspense} from 'react';

// Context and tools
import {UserProvider} from './UserProvider';
import useHearbeat from './hooks/useHeartbeat';

import "./utils.css"
import GroupsFeed from './pages/Groups/GroupsFeed';

// Page components (lazy loading to avoid loading overhead, initial bundle size and improve performance)
const Dashboard = lazy(() => import('./components/Dashboard'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const RegisterForm = lazy(() => import('./pages/RegisterForm/RegisterForm'));
const Groups = lazy(() => import('./pages/Groups/Groups'));
const Chat = lazy(() => import('./pages/Chat/Chat'));



/**
 * The main function of the app. It wraps the entire app in UserProvider 
 * and BrowserRouter and sets the basename to "/react-assignment1". 
 * It defines three routes: "/" that renders Dashboard, "/signup" that renders
 * RegisterForm, and "/profile" that renders Profile.
 */
export default function Main(){

    useHearbeat();
    
    return (
            <UserProvider>
                <Suspense fallback={<div>Loading...</div>}>
                    <BrowserRouter basename={process.env.PUBLIC_URL}>
                            <Routes>
                                <Route path="/" element={<Dashboard/>} />
                                <Route path="/signup" element={<RegisterForm/>} />
                                <Route path="/profile" element={<Profile/>} />
                                <Route path="/groups" element={<Groups/>}/>
                                <Route path="/groups/feed/:groupId" element={<GroupsFeed/>}/>
                                <Route path="/chat" element={<Chat />} />
                                <Route path="/chat/:chatId" element={<Chat/>}/>

                            </Routes>
                    </BrowserRouter>
                </Suspense>
            </UserProvider>
        
    );

}