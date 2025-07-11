import { useContext, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

//Context and tools
import { userContext } from "../../UserProvider";
import axiosInstance from "../../axiosInstance";
import { findUIDbyUsername } from "../../firebase/ReadWriteDB";

// Components and styling
import bg from "../../assets/images/scrollableBackground.png"
import BackgroundWrapper from "../../components/base-components/BackgroundWrapper";
import NavigationBar from "../../components/base-components/NavigationBar/NavigationBar";
import SideMenu from "../../components/SideMenu/SideMenu";
import Field from "../../components/base-components/Field/Field";
import PopupModal, { InviteWindow } from "../../components/base-components/PopupModal/PopupModal";
import GroupCard from "../../components/GroupCard/GroupCard";
import "./Groups.css"

export default function Groups() {

    const {user, loading} = useContext(userContext);

    const navigation = useNavigate();

    useEffect(()=>{
            if (!user) {
            navigation("/");
        }
    },[user,navigation]);


    const [groups, setGroups] = useState([]);
    const [newGroupName, setNewGroupName] = useState("");
    const [inviteGroupId, setInviteGroupId] = useState("");

    //Pop up
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(()=>{
        const fetchGroups = async ()=>{
            try{
                const response = await axiosInstance.get("/groups");
                if(response.status===200){
                    console.log(response.data.message);
                    console.log(response.data.groups);
                    setGroups(response.data.groups);
                }
            }
            catch(err){
                console.log(err);
                console.log(err.response?.data?.message);
            }
        }
        fetchGroups();
    },[]);


    const openPopup = (groupId)=>{
        setIsPopupOpen(true);
        setInviteGroupId(groupId);
    }

    const closePopup = ()=>{
        setIsPopupOpen(false);
    }

    const createGroup = async ()=> {
        const payload = {creator:user.uid, name: newGroupName};
        try{
            const response = await axiosInstance.post("/groups", payload);
            const {group, message} = response.data;
            if(response.status===201){
                console.log(message);
                console.log(group);
                setGroups((prev)=>[...prev, group]);
                openPopup(group._id);
            }
            else{
                console.log(response.data?.message);
            }

        }
        catch(err){
            console.log(err);
            console.log(err.response?.data?.message);
        }
    }
    const inviteFriend = async (e, userName="" , groupId, updateUI=null)=>{
        
        if(inviteGroupId==="" && !groupId ) return;

        try{
            console.log(`Inviting ${userName}`);
            const userObj = await findUIDbyUsername(userName);
            if(!userObj) return alert("User not found.");
            const userId = Object.keys(userObj)[0];
            console.log(`DB UserID: ${userId}`);

            const payloadGroupID = groupId? groupId : inviteGroupId;
            console.log(`groupId: ${payloadGroupID}`);
            const payload= {groupId:payloadGroupID};
            const response = await axiosInstance.put(`/groups/invite/${userId}`, payload);
            if(response.status===200){
                console.log(response.data.message);
                setGroups((prev)=>prev.map((group)=> group._id===payloadGroupID? response.data.group: group ));
                alert(`Invited ${userName} to the group successfully.`);
                if(updateUI) updateUI(response.data.group.members);
            }
        }
        catch(err){
            console.log(err);
            console.log(err.response?.data?.message);
            alert(err.response?.data?.message);
            console.log(err.response?.data?.error);
        }
        
    }

    if(loading) return <div>Loading...</div>;

    return(
        <BackgroundWrapper
            title="Groups"
            backgroundImage = {bg}
            backgroundPosition = "top center"
            backgroundRepeat="repeat-y"
            backgroundAttachment = "scroll"
            >
                
            <div className="groups">
                <NavigationBar/>
                <div className="page-container">
                    <SideMenu />
                    <div id="group-feed-wrapper">
                        <div id="new-group-form">
                            <Field
                                inputStyle="new-group-field"
                                type="text"
                                value={newGroupName}
                                onChange={(e)=>setNewGroupName(e.target.value)}
                                prompt="New group name.."/>
                            <button className="submit-button" id="create-group-button" 
                                    onClick={()=>{
                                        if(window.confirm(`Are you sure you want to create the group ${newGroupName}?`)){
                                            createGroup();
                                        }
                                        }}>
                                Create
                            </button>
                        </div>
                        <div id="groups-list">
                            {user && groups.length>0 && groups.map((group)=>(
                            <GroupCard
                                key={group._id}
                                groupID={group._id}
                                groupName={group.name}
                                creator={group.creator}
                                creationDate={group.creationDate}
                                members={group.members}
                                admins={group.admins}
                                chatID={group.chatId}
                                joinRequests={group.joinRequests}
                                onDelete={()=>{
                                    const newGroups = groups.filter((g)=>g._id!==group._id);
                                    setGroups(newGroups);
                                }}
                                onInvite={inviteFriend}

                            />))}
                        </div>
                    </div>
                    
                </div>
                <PopupModal styleId="invite-popup" onClose={closePopup} isOpen={isPopupOpen}>
                    <InviteWindow onInviteFriend={inviteFriend}/>
                </PopupModal>
            </div>

        </BackgroundWrapper>
    );
}