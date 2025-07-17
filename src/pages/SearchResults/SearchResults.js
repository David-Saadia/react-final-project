import { useLocation } from "react-router-dom";

// Context and tools
import { useRequireAuth } from "../../hooks/useRequireAuth";
import "../../utils.css";

//Compononets and styles
import "./SearchResults.css";

import BackgroundWrapper from "../../components/base-components/BackgroundWrapper";
import NavigationBar from "../../components/base-components/NavigationBar/NavigationBar";
import PostFeed from "../../components/PostFeed/PostFeed";
import SideMenu from "../../components/SideMenu/SideMenu"; 
import Chat from "../Chat/Chat";
import bg from "../../assets/images/scrollableBackground.png";
import Groups from "../Groups/Groups";


export default function SearchResults() {

    const location = useLocation();
    const results = location.state?.results || [];
    console.log(`results from searchResults page: ` , results);
    useRequireAuth();

    const resultsType = results[0]?.name? "groups" : "posts";
        
    return (
        <>
            {resultsType === "posts"
            ?
            //Setting page general attributes
                <BackgroundWrapper
                    title="Search Results"
                    backgroundImage = {bg}
                    backgroundPosition = "top center"
                    backgroundRepeat="repeat-y"
                    backgroundAttachment = "scroll"
                    >

                    <div className="search-results">
                        <NavigationBar/>
                        <div className="page-container" id="search-results-container">
                            <SideMenu />
                            {(results.length===0)
                                ? (<div className="no-results" onClick={() => window.history.back()}>No results found.</div>)
                                : (<PostFeed type="results" results={results}/>)
                            }
                            <Chat miniView={true}/>
                        </div>
                    </div>
                </BackgroundWrapper>
            :
                (results.length===0)
                    ? (<div className="no-results" onClick={() => window.history.back()}>No results found.</div>)
                    : (<Groups results={results}/>)
            }
        
        </>
      
    );
}