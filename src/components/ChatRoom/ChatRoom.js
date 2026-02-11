import { useContext, useEffect, useLayoutEffect, useRef, useState, useCallback} from 'react';

//Context and tools
import axiosInstance from '../../axiosInstance';
import { userContext } from '../../UserProvider';
import { useChatSocket } from '../../hooks/useChatSocket';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
//Components and styles
import Message from '../Message/Message';
import Field from '../base-components/Field/Field';
import SearchBar from '../base-components/SearchBar/SearchBar';
import "./ChatRoom.css"


export default function ChatRoom(props){
    
    const {user, token} = useContext(userContext);
    const {chatId, miniView = false} = props;
    //Chat related states
    const [messages, setMessages] = useState([]);
    const [hasMoreMsgs, setHasMoreMsgs] = useState(false);
    const [latestLoad, setLatestLoad] = useState(false);
    const [loading, setLoading] = useState(true);
    const [input, setInput] = useState('');

    //Search related states
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [foundMessage, setFoundMessage] = useState('');

    
    //Scrolling
    const endRef = useRef(null);
    const startRef = useRef(null);
    const [atTop, setAtTop] = useState(false);
    const [atBottom, setAtBottom] = useState(false);
    const [highlightedMsgId, setHighlightedMsgId] = useState(null);
    const targetScrollMsgId = useRef(null);

    const showScrollLoadBtn = atTop !== atBottom && !isSearching;
    const scrollLoadBtnText = atTop ? "Load more" : "Scroll to top";

    const mergeMessages = (existing, newMsgs, direction) => {
        const combined = direction === 'older' 
            ? [...newMsgs, ...existing] 
            : [...existing, ...newMsgs];
        
        //Remove duplicates (in case of overlap between existing and new messages)
        const uniqueMap = new Map();
        combined.forEach(msg => uniqueMap.set(msg._id, msg));
        
        return Array.from(uniqueMap.values());
    };

    const onMessageReceived = (msg) =>{
        setMessages(prev => mergeMessages( prev, [msg], 'newer').slice(-41));
    }

    //Extracted socket.io logic to a custom hook for better readability and separation of concerns.
    const socketRef = useChatSocket(chatId, token, onMessageReceived, latestLoad);

    const loadMoreMessages = useCallback( async (direction) =>{
        setLoading(true);
        try{
            if(direction ==="older"){
                //DEBUG: console.log(`Attempting to pull older messages for chat ${chatId}`);
                const oldestMsgId = messages[0]?._id;
                targetScrollMsgId.current = { id: oldestMsgId, align: "start" };
                const response = await axiosInstance.get(`/chats/${chatId}?before=${oldestMsgId}`);
                if (response.status===200){
                    //We get 20 more messages, we display only 41 messages on the screen at once.
                    //DEBUG: console.log(response.data.messages);
                    setLatestLoad(false);
                    console.log("Chat has more:" , response.data.hasMore);
                    setHasMoreMsgs(response.data.hasMore);
                    setMessages(prev => mergeMessages(prev, response.data.messages, 'older').slice(0, 41));
                }
            }
            else if(direction === "newer"){
                if(latestLoad) return;
                //DEBUG: console.log(`Attempting to pull newer messages for chat ${chatId}`);
                const newestMsgId = messages[messages.length-1]?._id;
                targetScrollMsgId.current = { id: newestMsgId, align: "end" };
                const response = await axiosInstance.get(`/chats/${chatId}?after=${newestMsgId}`);
                if (response.status===200){
                    //We get 20 more messages, we display only 41 messages on the screen at once.
                    //DEBUG: console.log(response.data.messages);
                    setLatestLoad(!response.data.hasMore);
                    console.log("Latest load:", !response.data.hasMore);
                    //If we're loading new messages, the chat definitely has older messages, the ones we just voided.
                    if(messages.length + response.data.messages.length > 41) 
                        setHasMoreMsgs(true);
                    setMessages(prev => mergeMessages(prev, response.data.messages, 'newer').slice(-41));
                    
                }
            }
            setLoading(false);
          
        }catch(err){
            console.log(err);
            console.log(err.response?.data?.message);
            setLoading(false);
        }
        
    },[chatId, messages, latestLoad]);

    const onTopIntersect = useCallback((isIntersecting) =>{
        if(hasMoreMsgs)
            setAtTop(isIntersecting);
        else{
            //If we have no more messages, we don't want loadMore button to appear.
            //DEBUG: console.log(`No more messages to load`);
            setAtTop(false);
        }
    },[hasMoreMsgs]);

    const onBottomIntersect = useCallback((isIntersecting) =>{
        setAtBottom(isIntersecting);
        //Load more messages if not latest load and we are at the bottom of the chat
        if(isIntersecting && messages.length > 0 && !loading && !latestLoad)
            loadMoreMessages("newer");
    },[messages.length, loading, latestLoad, loadMoreMessages]);

    useIntersectionObserver({
        startRef,
        endRef,
        onTopIntersect,
        onBottomIntersect,});

    const sendMessage = async () => {

        const joined = socketRef.current.joined;

        if(!input.trim() || joined === false){

            if(!input.trim())
                console.log(`input is empty`);
            if(!joined)
                console.log(`not joined`);
            return; //Empty string.
        } 
        socketRef.current.emit('message', {author: user.uid, content: input, chat: chatId});
        setInput('');
    }

    const getResultContextWindow = async (messageId) =>{
        setLoading(true);
        console.log(`Attempting to get context window for message ${messageId}`);
        try{
            const response = await axiosInstance.get(`/chats/${chatId}/context?msgId=${messageId}`);
            if(response.status === 200){
                const contextMessages = response.data.contextWindow;
                //DEBUG: console.log(`Context window messages: `, contextMessages);
                //DEBUG: console.log('Has more before:', response.data.hasMoreBefore, 'Has more after:', response.data.hasMoreAfter);
                setMessages(contextMessages);
                setHasMoreMsgs(response.data.hasMoreBefore);
                setLatestLoad(!response.data.hasMoreAfter);
                targetScrollMsgId.current = { id: messageId, align: "center" };
                
                //Highlight the found message and scroll to it.
                setHighlightedMsgId(messageId);
                setTimeout(()=>{
                    setHighlightedMsgId(null);
                },1000);
                setLoading(false);
                
            }

        }catch(err){
            console.log(err);
            console.log(err.response?.data?.message);
            setLoading(false);
        }
    }
    
    const searchMessages = async () => {
        /*Fetch messages matching the search query on DB.
        Then if we have any results, fetch the context window of the most recent matched message.
        Then, scroll to that message and highlight it.
        */
        console.log("Attempting to find messages with the query: ", searchQuery);
        if(!searchQuery.trim()) return console.log('Search query is empty');

        try{
            const response = await axiosInstance.get(`/chats/${chatId}/search?keywordContent=${searchQuery}`);
            if(response.status === 200){
                const matchedMsgs = response.data.matchedMessages;
                console.log(`Search results: `, matchedMsgs);
                setSearchResults(matchedMsgs);
                setFoundMessage(matchedMsgs.length - (matchedMsgs.length-1) );
                getResultContextWindow(matchedMsgs[matchedMsgs.length-1]._id);

            }
        }catch(err){
            console.log(err);
            console.log(err.response?.data?.message);
        }
        
    }

    const handleLoadScroll = () =>{
        if(atTop && hasMoreMsgs){
           loadMoreMessages("older");
        }
        else if(atBottom)
            startRef.current?.scrollIntoView({behavior: "smooth", block: "end"});
    }

    const handleShuffleResults = (direction) =>{
        if(searchResults.length === 0) return;

        //DEBUG: console.log(searchResults);
        /*NOTE: reverse scrolling is happening here.
        * That means we are navigating through the last item in the array, towards the first.
        * Additionally, foundMessage represents the result index from most recent, so the last item
        * in the array is the first result. When we scroll up, we navigate towards an older message,
        * therefore foundMessage increases, but that means the actual index in the array decreases.
        * Don't get confused.*/

        //Another Note: Maybe we should have reversed the array from DB... Oh well


        if(direction === "up" && foundMessage < searchResults.length){
            const newFoundMessage = foundMessage + 1;
            const newIndex = searchResults.length - newFoundMessage;
            console.log(`Scrolling to message ${searchResults[newIndex]}`);
            getResultContextWindow(searchResults[newIndex]._id);
            setFoundMessage(newFoundMessage);
        }
        else if(direction === "down" && (foundMessage - 1) > 0){
            const newFoundMessage = foundMessage - 1;
            const newIndex = searchResults.length - newFoundMessage;
            console.log(`Scrolling to message ${searchResults[newIndex]}`);
            getResultContextWindow(searchResults[newIndex]._id);
            setFoundMessage(newFoundMessage);
        }
    }

    useEffect(() => {
        const fetchMessages = async () => {
  
            try{
                console.log(`Attempting to pull messages for chat ${chatId}`);
                const response = await axiosInstance.get(`/chats/${chatId}`);
                if (response.status===200){
                    //DEBUG: console.log(response.data.messages);
                    setMessages(response.data.messages);
                    console.log("Chat has more:" , response.data.hasMore);
                    setHasMoreMsgs(response.data.hasMore);
                    setLatestLoad(true);
                    setLoading(false);
                }
            }
            catch(err){
                console.log(err);
                console.log(err.response?.data?.message);
            }
        }
        fetchMessages();
    },[chatId]);

    useLayoutEffect(() => {
        
        if(targetScrollMsgId.current){
            const element = document.getElementById(`msg-${targetScrollMsgId.current.id}`);
            if (element) element.scrollIntoView({behavior: "auto", block: targetScrollMsgId.current.align});
            targetScrollMsgId.current = null;
        }
        else if(!isSearching && latestLoad && !loading){
            endRef.current?.scrollIntoView({behavior: "smooth", block: "end"});
        }
    },[messages, isSearching, latestLoad, loading]);

    
    useEffect(()=>{
        if(!isSearching){
            setSearchResults([]);
            setSearchQuery('');
            setFoundMessage('');
        }
    },[isSearching]);


    return(
    <div className="chat-room">
        {!miniView && 
            <SearchBar 
                searchFieldStyleId='chat-messages-search-field' 
                searchFieldContainerStyleClass="search-msg-container"
                buttonStyleClass="search-msg-toggle-button"
                value={searchQuery}
                onChange={setSearchQuery}
                onIsSearching={setIsSearching}
                onSearch={searchMessages}
                hangingContainer={
                  <>
                    {searchResults.length>0 && 
                        <div className="shuffle-results-container">
                            <span className="shuffle-results-text">{`Result ${foundMessage} of ${searchResults.length}`}</span>
                            <div className="results-buttons-container">
                                <button className="shuffle-button" onClick={()=>handleShuffleResults("up")}>▲</button>
                                <button className="shuffle-button" onClick={()=>handleShuffleResults("down")}>▼</button>
                            </div>
                        </div>
                    }
                  </>
                }
                />}
        <div className="chat-messages-area">
            <div ref={startRef}/>
            <ul className="messages-list">
                {(messages.length>0) && messages.map((message,_)=>(<Message key={message._id} message={message} isHighlighted={message._id === highlightedMsgId}/>))}
            </ul>
            <div ref={endRef} />
        </div>
        
        <div className="chat-input-area">
            <Field inputStyle="chat-msg-input" value={input} onChange={(e)=>setInput(e.target.value)} prompt="Type a message..."
                onKeyDown={(e)=> e.key==="Enter" && sendMessage()}
                styleClass="chat-input-field"
            />
            <button className="send-button" onClick={sendMessage}>Send</button>
        </div>

        {showScrollLoadBtn  && (document.activeElement !== document.getElementById("chat-msg-input")) &&
            <button className="scroll-load-button" onClick={handleLoadScroll}>
                {scrollLoadBtnText}
            </button>
        }

    </div>

    );
}