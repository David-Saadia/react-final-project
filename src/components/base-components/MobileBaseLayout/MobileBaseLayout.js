import { useState } from "react";
import SideMenu from "../../SideMenu/SideMenu";
import ChatList from "../../ChatList/ChatList";
import { ChatIcon } from "../../IconSVGs";
import "./MobileBaseLayout.css";

/**
 * A wrapper component that implements the standard 3-column layout (SideMenu - Content - ChatList).
 * It handles the mobile responsiveness logic, including the toggle buttons and collapsible menus.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The main content to display in the center (e.g., PostFeed).
 * @param {string} [props.pageContainerId] - Optional ID for the container div to apply page-specific styles.
 * @param {string} [props.className] - Optional extra classes for the container.
 */
export default function MobileBaseLayout({ children, pageContainerId, className, preSelectedChat }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);


    const toggleMenu = () => {
        if(isChatOpen) setIsChatOpen(false);
        setIsMenuOpen(!isMenuOpen);
    }

    const toggleChat = () => {
        if(isMenuOpen) setIsMenuOpen(false);
        setIsChatOpen(!isChatOpen);
    }

    return (
        <div className={`page-container ${className || ""}`} id={pageContainerId}>
            <button className={`mobile-toggle-btn left-toggle ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>{isMenuOpen ? "‹" : "≡"}</button>
            <button className={`mobile-toggle-btn right-toggle ${isChatOpen ? "active" : ""}`} onClick={toggleChat}>{isChatOpen ? "›" : <ChatIcon size={14}/>}</button>
            <SideMenu className={isMenuOpen ? "mobile-open" : ""}/>
            {children}
            <ChatList className={isChatOpen ? "mobile-open" : ""} preSelectedChat={preSelectedChat}/>
        </div>
    );
}


export function MobileBaseChatLayout({ children, pageContainerId, className, handleChatSelected }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    console.log(handleChatSelected);

    return (
        <div className={`page-container ${className || ""}`} id={pageContainerId}>
            <button className={`mobile-toggle-btn left-toggle ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>{isMenuOpen ? "‹" : "≡"}</button>
            <SideMenu className={isMenuOpen ? "mobile-open" : ""}/>
            {children}
            <ChatList className={"chat-mobile-open"} handleChatSelected={handleChatSelected}/>
        </div>
    );
}