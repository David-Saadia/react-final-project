
/**
 * Game plan: For posts - search on enter (because we have sorting options, likes, comments,date) we only search on button press.
 * For messages, usernames, groupnames, we can search by using useDebounce to get search results as the user types.
 * For posts, the user will have it's page navigate to the search results page.
 * For usernames, groupnames, the user will have a collapseable search results menu.
 * for messages, the user will have collapsable search results with a shortened version of the match.
 */

import { startTransition, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {useDebounce} from "../../hooks/useDebounce";
import { getAllUsernames } from "../../firebase/ReadWriteDB";
import axiosInstance from "../../axiosInstance";

import Field from "../base-components/Field/Field";
import "./SearchBar.css"
import DropDownMenu from "../base-components/DropDownMenu/DropDownMenu";
import PopupModal, { MessageWindow } from "../base-components/PopupModal/PopupModal";
import ToggleSlider from "../base-components/ToggleSlider/ToggleSlider";


export default function SearchBar(props){

    const [isSearching, setIsSearching] = useState(false);

    const navigate = useNavigate();

    const [results, setResults] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [byLikes, setByLikes] = useState(false);
    const [byComments, setByComments] = useState(false);
    const [byMembers, setByMembers] = useState(false);
    const [byPosts, setByPosts] = useState(false);
    const [input, setInput] = useState("");
    const [popupOpen, setPopupOpen] = useState(false);
    const [messaged, setMessaged] = useState("");
    const {type} = props; //Types:  "posts", "messages"
    const [searchType, setSearchType] = useState(false);

    const debouncedKeywordQuary = useDebounce(input, 1000);

    const goTo = (path, options={}) => {
        startTransition(() => {
            navigate(path, options);
        });
    }

    const closePopup = () => {
        setPopupOpen(false);

    };

    const openPopup = (messagedUser) => {
        setPopupOpen(true);
        setMessaged(messagedUser);
    };

    useEffect(()=>{
        const fetchResults = async ()=>{
          try{
            const responseGroups = await axiosInstance.get(`/groups/searchquery/?keywordName=${debouncedKeywordQuary}`);
            if(responseGroups.status===200){
                console.log(responseGroups.data.message);
                setResults(prev=>[...prev, ...responseGroups.data.groups.map((group)=>({name:group.name, groupId:group._id, type:"group"}))]);
            }
          }
          catch(err){
              console.log(err);
              console.log(err.response?.data?.message);
          }
        }
        
        const fetchResultsUsernames = async () =>{
            try{
                const response = await getAllUsernames();
                console.log(`responseUsers: ` ,response);
                const matchedUsers = [];
                for(const [id, user] of Object.entries(response)){
                    if (user.username.toLowerCase().includes(debouncedKeywordQuary.toLowerCase())) 
                        matchedUsers.push({name:user.username, uid:id, type:"user"});
                }
                console.log(`matchedUsers: ` ,matchedUsers);
                setResults(prev=>[...prev, ...matchedUsers]);
            }
            catch(err){
                console.log(err);
            }
            
        }

        if(debouncedKeywordQuary.trim() === "") return setResults([]);

        fetchResults();
        fetchResultsUsernames();
        return () => setResults([]);
    },[debouncedKeywordQuary])

    const  handleSearchPost = async () =>{
          try{
                console.log(`Fetching results for keyword: ${input}
                with startDate: ${startDate}
                and endDate: ${endDate}
                with byLikes: ${byLikes}
                and byComments: ${byComments}`);
          
                const response = await axiosInstance.get(`/posts/search/?${startDate? `dateFrom=${startDate}&`:""}${endDate? `dateTo=${endDate}&`:""}sortByLikes=${byLikes}&sortByComments=${byComments}&keywordContent=${input}`);
                if(response.status===200){
                    console.log(response.data.message);
                    //DEBUG: console.log(response.data.posts);
                    goTo('/search/results', {state: {results: response.data.posts}});
                }
            }
            catch(err){
                console.log(err);
                console.log(err.response?.data?.message);
            }
    }

    const  handleSearchGroup = async () =>{
          try{
                console.log(`Fetching results for keyword: ${input}
                with startDate: ${startDate}
                with byPosts: ${byPosts}
                and byMembers: ${byMembers}`);
          
                const response = await axiosInstance.get(`/groups/searchquery/?${startDate? `dateFrom=${startDate}&`:""}sortByPosts=${byPosts}&sortByMembers=${byMembers}&keywordName=${input}`);
                if(response.status===200){
                    console.log(response.data.message);
                    //DEBUG: console.log(response.data.posts);
                    goTo('/search/results', {state: {results: response.data.groups}});
                }
            }
            catch(err){
                console.log(err);
                console.log(err.response?.data?.message);
            }
    }

    return(
    <div className="search-bar-container">  
        <div className="search-bar-field-container">
            {type==="posts" && 
                <button onClick={() => setIsSearching(!isSearching)} id="search-button"></button>
            }
            <div className={`search-bar-search-type-container ${type==="posts" && isSearching? "active" : ""}`}>
                <DropDownMenu styleId="search-dropdown" options={results.map((result)=>result.name)} optionsMetaData={results}
                    onChange={(option, metaData)=>{
                        if(metaData.type==="user")
                            openPopup(metaData.uid);
                        else if(metaData.type==="group")
                            goTo(`/groups/feed/${metaData.groupId}`);
                        }}>
                    <Field type="text" prompt={props?.prompt || "Search..."}
                    value={input} onChange={(e)=>setInput(e.target.value)}
                    onKeyDown={(e)=>{e.key==="Enter" &&(searchType? handleSearchGroup(): handleSearchPost())}}
                    styleClass={`search-bar ${type==="posts" && isSearching? "active" : ""}`} 
                    styleId={`${type==="posts"? "nav-search":""}`} inputStyle={`${props.inputStyleAdditions}`}
                    />    
                </DropDownMenu>
                {
                    type==="posts" &&
                    <ToggleSlider  
                        labelClass="sort-toggle" sliderText="Posts  |  Groups" name="posts-groups"
                        buttonId="change-sort-options-btn" onChange={()=>setSearchType(prev=>!prev)}/>
                
                }
            </div>
           
        </div>
        <div className={`search-sorting-container ${type==="posts" && isSearching && "active"}`}>
            {searchType
                ? 
                    <div className="sort-options">
                        <label htmlFor="sort-posts-btn" className="sort-option">Sort by posts<input id="sort-posts-btn" className="check-box-btn" name="members" title="posts" type="checkbox" onChange={()=>setByPosts(prev=>!prev)}/></label>
                        <label htmlFor="sort-members-btn" className="sort-option">Sort by members<input id="sort-members-btn" className="check-box-btn" name="posts" title="members" type="checkbox" onChange={()=>setByMembers(prev=>!prev)}/></label>
                    </div>
                :
                    <div className="sort-options">
                        <label htmlFor="sort-likes-btn" className="sort-option">Sort by likes<input id="sort-likes-btn" className="check-box-btn" name="likes" title="likes" type="checkbox" onChange={()=>setByLikes(prev=>!prev)}/></label>
                        <label htmlFor="sort-comments-btn" className="sort-option">Sort by comments<input id="sort-comments-btn" className="check-box-btn" name="comments" title="comments" type="checkbox" onChange={()=>setByComments(prev=>!prev)}/></label>
                    </div>
            }
            <div className="date-selectors">
                <label htmlFor="date-btn-from" className="date-selector"> From:
                    <input type="date" min="1960-01-01" max="2025-07-17"  className= "submit-button date-btn" id="date-btn-from" value={startDate} onChange={(e)=>setStartDate(e.target.value)}/>
                </label>
                {!searchType &&
                    <label htmlFor="date-btn-to" className="date-selector"> To:
                        <input type="date" min="1960-01-01" max="2025-07-17"  className= "submit-button date-btn" id="date-btn-to" value={endDate} onChange={(e)=>setEndDate(e.target.value)}/>
                    </label>
                }
            </div>
        </div>
        {
            <PopupModal isOpen={popupOpen} onClose={() => closePopup()}>
                <MessageWindow receiver={messaged} onClose={() => closePopup()}/>
            </PopupModal>
        }
    </div>
    );

}