import { useEffect, useRef } from 'react';
import {io} from 'socket.io-client';

export const useChatSocket = (chatId, token, onMessageReceived, isLive) => {
    const socketRef = useRef(null);
    const isLiveRef = useRef(isLive);
    const onMessageReceivedRef = useRef(onMessageReceived);

    //Update live status (if we're in the chat room with the latest page of messages).
    useEffect(() => {
        isLiveRef.current = isLive;
    }, [isLive]);

    useEffect(() => {
        if (!chatId || !token) return;

        const socket = io('http://localhost:42069');
        socketRef.current = socket;
        socketRef.current.joined = false;

        socket.emit('authenticate', token);

        socket.on('authenticated', (response) => {
            console.log(response?.message);
            socket.emit('joinChat', chatId)
        });

        socket.on('joinedChat', (response)=> {
            console.log(response?.message);
            socketRef.current.joined = true;
        })
        
        socket.on('message', (msg) => {
            //DEBUG: console.log(socket.id);
            //DEBUG: console.log(msg.content);
            if (isLiveRef.current) {
                onMessageReceivedRef.current(msg);
            }
        });
        
        socket.on('error', (errObj) =>{
            console.log(errObj?.message);            
        });

        return () => {
            socket.disconnect(); 
            socketRef.current.joined=false;
        }
    }, [chatId, token]); 

    return socketRef;
};