import { useState } from "react";

import "./TabbedContent.css";

/**
 * TabbedContent: A functional component that creates a tabbed interface.
 * Given an array of strings (tab names) and an array of JSX elements (content),
 * it will create a tabbed interface with the given tab names and content,
 * and will switch between the content based on the selected tab.
 * The component will automatically default to the first tab.
 * @param {object} props - The properties for the TabbedContent component.
 * @param {string[]} props.tabs - An array of tab names.
 * @param {JSX.Element[]} props.content - An array of JSX elements to be used as the content for each tab.
 * @param {string} [props.tabStyleId] - An optional string to be used as the CSS id for each tab.
 */
export default function TabbedContent(props){

    const [tab, setTab] = useState(props.tabs[0]); //Default to first tab

    return(
    <>
        <div className="tabs">
            {props.tabs.map((tabItem, index)=>
                <button key={index} className={`tab-link ${tab===tabItem? "active": ""}`} id={props.tabStyleId?? ""} onClick={() => setTab(tabItem)}>{tabItem.charAt(0).toUpperCase() + tabItem.slice(1)}</button>
            )}
        </div>

            {props.tabsContent?.map((content, index)=>

            <div key={index} className={`tab-content ${tab===props.tabs[index]? "active": ""}`} id={`tab-${props.tabs[index]}`}>
                {content}
            </div>
            )}
          
    </>);
}