import {useContext} from "react";	

// Context and tools
import {userContext} from "../../UserProvider";
import "../../utils.css";

//Compononets and styles
import "./Home.css";
//import CardForm from "../CardForm/CardForm";
//import CardTable from "../CardTable/CardTable";
import BackgroundWrapper from "../base-components/BackgroundWrapper";
import bg from "../../assets/images/scrollableBackground.png";
import NavigationBar from "../base-components/NavigationBar/NavigationBar";
import PostFeed from "../PostFeed/PostFeed";
import SideMenu from "../SideMenu/SideMenu"; 

/**
 * A component that renders the main page of the application. The page is
 * divided into two sections. The top section contains a CardForm component
 * that allows the user to add a new row to the table. The bottom section
 * contains a CardTable component that displays the table with the rows that
 * the user has entered. The component uses the useState hook to store the
 * data in the table and the useEffect hook to fetch the data when the
 * component is mounted. The data is fetched from the reqres.in API. The
 * component also sets the page title and the background image of the page
 * when it is mounted.
 * 
 * @returns A JSX element representing the Home component.
 */
export default function Home() {

    const {loading} = useContext(userContext);

    
    if(loading) return <div>Loading...</div>;


    return (
        //Setting page general attributes
        <BackgroundWrapper
            title="Home"
            backgroundImage = {bg}
            backgroundPosition = "top center"
            backgroundRepeat="repeat-y"
            backgroundAttachment = "scroll"
            >

            <div className="home">
                <NavigationBar currentPage="home"/>
                <div className="page-container">
                    <SideMenu />
                    <PostFeed />
                </div>
            </div>
        </BackgroundWrapper>
    );
}