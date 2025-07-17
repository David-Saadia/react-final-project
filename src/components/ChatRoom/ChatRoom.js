import { useContext, useEffect, useRef, useState } from 'react';
import {io} from 'socket.io-client';
import axiosInstance from '../../axiosInstance';
import { userContext } from '../../UserProvider';
import Message from '../Message/Message';
import Field from '../base-components/Field/Field';

import "./ChatRoom.css"




export default function ChatRoom(props){
    
    const socketRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const {user, token} = useContext(userContext);
    const endRef = useRef(null);
    const {chatId} = props;
    const [joined, setJoined] = useState(false);

    useEffect(() => {
        const fetchMessage = async () => {
            setMessages([]);
            
            try{
                console.log(`Attempting to pull messages for chat ${chatId}`);
                const response = await axiosInstance.get(`/chats/${chatId}`);
                if (response.status===200){
                    console.log(response.data.message);
                    //DEBUG: console.log(response.data.messages);
                    setMessages(response.data.messages);
                }
            }
            catch(err){
                console.log(err);
                console.log(err.response?.data?.message);
            }
        }
        fetchMessage();
    },[chatId]);


    useEffect(() => {
        if(!chatId || !token) return;
        const socket = io('http://localhost:42069');
        socketRef.current = socket; 
        
        if(socket.current===null) {
            console.log(`socket is null`);
            return;};
        //console.log(`token: ${token}`);
       
        socket.emit('authenticate', token);

        
        socket.on('authenticated', (response)=>{ 
            console.log(response?.message);
            socket.emit('joinChat', chatId);
        });
        
        socket.on('joinedChat', (response)=>{ console.log(response?.message); setJoined(true);});

        socket.on('message', (msg) => {
            //DEBUG: console.log(socket.id);
            //DEBUG: console.log(msg.content);
            setMessages(prev=>[...prev, msg]);
        });

        socket.on('error', (errObj) =>{
            console.log(errObj?.message);            
        });

        return () => {
          if(socketRef.current){
            socketRef.current.disconnect();
            socketRef.current = null;
          }
          setJoined(false);
          setMessages([]);
        }
    },[chatId, token]);

    useEffect(() => {
        endRef.current?.scrollIntoView({behavior: "smooth"});
    },[messages]);

    const sendMessage = async () => {
        if(!input.trim() || !joined){
            console.log(`input is empty`);
            if(!joined)
                console.log(`not joined`);
            return; //Empty string.
        } 
        socketRef.current.emit('message', {author: user.uid, content: input, chat: chatId});
        setInput('');
    }
    return(
    <div className="chat-room">
        <ul className="messages">
            {(messages.length>0) && messages.map((message,index)=>(<Message key={index} message={message}/>))}
        </ul>
        <div ref={endRef}></div>
        <div className="chat-input grouped">
            <Field value={input} onChange={(e)=>setInput(e.target.value)} prompt="Message..."
                onKeyDown={(e)=> e.key==="Enter" && sendMessage()}/>
            <button onClick={sendMessage}>Send</button>
        </div>
    </div>

    );
}