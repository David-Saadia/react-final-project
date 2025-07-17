import bg from "../../assets/images/scrollableBackground.png";
import BackgroundWrapper from "../../components/base-components/BackgroundWrapper";
import NavigationBar from "../../components/base-components/NavigationBar/NavigationBar";
import SettingsCard from "../../components/SettingsCard/SettingsCard";
import SideMenu from "../../components/SideMenu/SideMenu";

import Chat from "../Chat/Chat";

export default function Settings(props) {



    return(
        //Setting page general attributes
        <BackgroundWrapper
            title="Settings Page"
            backgroundImage = {bg}
            backgroundPosition = "top center"
            backgroundRepeat="repeat-y"
            backgroundAttachment = "scroll"
            >

            <div className="settings">
                <NavigationBar/>
                <div className="page-container" id="home-container">
                    <SideMenu />
                    <SettingsCard/>
                    <Chat miniView={true}/>
                </div>
            </div>
        </BackgroundWrapper>
    );
}