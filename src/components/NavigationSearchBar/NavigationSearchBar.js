
/**
 * Game plan: For posts - search on enter (because we have sorting options, likes, comments,date) we only search on button press.
 * For messages, usernames, groupnames, we can search by using useDebounce to get search results as the user types.
 * For posts, the user will have it's page navigate to the search results page.
 * For usernames, groupnames, the user will have a collapseable search results menu.
 * for messages, the user will have collapsable search results with a shortened version of the match.
 */

import { useEffect, useState } from "react";

import { useDebounce } from "../../hooks/useDebounce";
import useGoTo from "../../hooks/useGoTo";
import { getAllUsernames } from "../../firebase/ReadWriteDB";
import axiosInstance from "../../axiosInstance";

import ToggleSlider from "../base-components/ToggleSlider/ToggleSlider";
import SearchBar from "../base-components/SearchBar/SearchBar";
import "./NavigationSearchBar.css"


export default function NavigationSearchBar(props){

    const [isSearching, setIsSearching] = useState(false);

    const goTo = useGoTo();

    const [results, setResults] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [byLikes, setByLikes] = useState(false);
    const [byComments, setByComments] = useState(false);
    const [byMembers, setByMembers] = useState(false);
    const [byPosts, setByPosts] = useState(false);
    const [input, setInput] = useState("");
 
    const [searchType, setSearchType] = useState(false);

    const debouncedKeywordQuery = useDebounce(input, 1000);


    useEffect(()=>{
        if(debouncedKeywordQuery.trim() === "") {
            setResults([]);
            return;
        }

        let isMounted = true;

        const fetchAllResults = async () => {
            try {
                const [groupsRes, usersRes] = await Promise.allSettled([
                    axiosInstance.get(`/groups/searchquery/?keywordName=${debouncedKeywordQuery}`),
                    getAllUsernames()
                ]);

                if (!isMounted) return;

                let newResults = [];

                if (groupsRes.status === "fulfilled" && groupsRes.value.status === 200) {
                    newResults.push(...groupsRes.value.data.groups.map((group) => ({ name: group.name, groupId: group._id, type: "group" })));
                }

                if (usersRes.status === "fulfilled") {
                    const users = usersRes.value;
                    for (const [id, user] of Object.entries(users)) {
                        if (user.username.toLowerCase().includes(debouncedKeywordQuery.toLowerCase())) {
                            newResults.push({ name: user.username, uid: id, type: "user" });
                        }
                    }
                }
                
                setResults(newResults);

            } catch (err) {
                console.log(err);
            }
        };

        fetchAllResults();
        
        return () => { isMounted = false; };
    },[debouncedKeywordQuery])

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

    const handleSearchGroup = async () =>{
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

    const resultsOnSelect = (option, metaData) => {
        console.log("Selected option:", option, metaData);
        if (metaData.type === "user") 
            goTo(`/profile/${metaData.uid}`);

        else if (metaData.type === "group") 
            goTo(`/groups/feed/${metaData.groupId}`);
        
    }
    return(
        
        <SearchBar
            //Data Props
            value={input}                //Pass state down
            onChange={setInput}          //Update state directly
            onSearch={searchType ? handleSearchGroup : handleSearchPost}
            onIsSearching={setIsSearching}
            
            //Results Props
            results={results}
            resultsOnSelect={resultsOnSelect}
            
            //UI Props
            prompt={props.prompt}
            searchFieldContainerStyleId="nav-search"
            searchFieldStyleId={props.inputStyleAdditions}
            
            // Composition Props (Slot pattern)
            hangingContainer={
                <div className={`search-sorting-container ${ isSearching && "active"}`}>
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
            }

            controlContainer={
                <ToggleSlider  
                labelClass="sort-toggle" sliderText="Posts | Groups" name="posts-groups"
                buttonId="change-sort-options-btn" onChange={()=>setSearchType(prev=>!prev)}/>
            }

        />
    
    );

}