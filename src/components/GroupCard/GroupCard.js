import { startTransition, useContext, useEffect, useState } from "react";

//Context and tools
import { userContext } from "../../UserProvider";
import { findAvatarDB, findUserNameDB } from "../../firebase/ReadWriteDB";
import axiosInstance from "../../axiosInstance";

//Components and styles
import ScreenTitle from "../base-components/ScreenTitle/ScreenTitle";
import PopupModal, { ConfigureGroupWindow, InviteWindow, MembersListWindow, StatisticsNewImageWindow } from "../base-components/PopupModal/PopupModal";
import TabbedContent from "../base-components/TabbedContent/TabbedContent";
import "./GroupCard.css"
import { useNavigate } from "react-router-dom";

/**
 * 
 * @param {object} props - Object to contain key-value pairs of arguments for the function.
 * @param {string} props.groupID 
 * @param {string} props.chatID 
 * @param {string} props.creationDate 
 * @param {string} props.creator
 * @param {string} props.groupName
 * @param {string} props.groupImage
 * @param {[string]} props.members
 * @param {[string]} props.admins
 * @returns 
 */
export default function GroupCard(props){

    const {user, fetchUserPFP} = useContext(userContext);
    const {creator,  groupID, chatID} = props //Don't change - no need for useState.
    const [groupName, setGroupName] = useState(props.groupName);
    const [groupImage, setGroupImage] = useState("");
    const [members, setMembers] = useState(props.members);
    const [membersAvatars, setMembersAvatars] = useState([]);
    const [membersUsernames, setMembersUsernames] = useState([]);
    const [admins, setAdmins] = useState(props.admins);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [joinRequests, setJoinRequests] = useState(null);
    const navigation = useNavigate();

    const goTo = (path) => {
        startTransition(() => {
            navigation(path);
        });
    }
    

    useEffect(()=>{
        const fetchGroupImage = async ()=>{
            const img = props.groupImage? props.groupImage: await findAvatarDB(creator);
            if(typeof img === "string" && img.includes("static"))
                setGroupImage(img);
            else{
                const fetchedAvatar = await fetchUserPFP(img._id, false);
                console.log(`groupImage: ${img}`);
                console.log(`fetchedAvatar: ${fetchedAvatar}`);
                if(fetchedAvatar){
                    setGroupImage(fetchedAvatar);
                }
            }
        }

        const fetchMembersImages = async (limit=-1) =>{
            if(limit<0 && members){
                const avatars = await Promise.all(members.map(async (member)=>{
                    const avatar = await findAvatarDB(member);
                    if(avatar.includes("static"))
                        return avatar;
                    else{
                        const fetchedAvatar = await fetchUserPFP(avatar, false);
                        if(fetchedAvatar)
                            return fetchedAvatar;
                    }
                }));
                setMembersAvatars(avatars);
            }
        }

        const fetchMembersUsernames = async (limit=-1) =>{ 
            if(limit<0 && members){
                const usernames = await Promise.all(members.map(async (member)=>{
                    const username = await findUserNameDB(member);
                    return {username,uid:member};
                }));
                setMembersUsernames(usernames);
            }
        }
        fetchGroupImage();
        fetchMembersImages();
        fetchMembersUsernames();
        
    },[props.groupImage, creator, members, fetchUserPFP]);


    useEffect(()=>{
        const fetchJoinRequestsData = async ()=>{
            if(!props.joinRequests || props.joinRequests.length===0) return;

            const data = await Promise.all(props.joinRequests.map(async (member)=>{
                if(typeof member !== "string") return;
                const username = await findUserNameDB(member);
                const avatar = await findAvatarDB(member);
                if(!username || !avatar){
                    console.log('possible undefined hit');
                    return null;
                } 
                //console.log(`username: ${username}, uid: ${member}, avatar: ${avatar}`);
                return {username, uid:member, avatar}; 
            }));
            setJoinRequests(data.filter(Boolean));
        
        }
        fetchJoinRequestsData();

    },[props.joinRequests])

    const isJoined = ()=>{
        return members && members.includes(user.uid);
    }

    const isAdmin = ()=>{
        return admins && admins.includes(user.uid);
    }

    const deleteGroup = async ()=>{
        try{
            const response = await axiosInstance.delete(`/groups/${groupID}`); 
            if (response.status===200){
                console.log(response.data.message);
                alert(response.data.message);
                props.onDelete();
            }
        }
        catch(err){
            console.log(err);
            console.log(err.response?.data?.message);
        }

    }

     const openPopup = ()=>{
        setIsPopupOpen(true);
    }

    const closePopup = ()=>{
        setIsPopupOpen(false);
    }

    const kickMember = async (kickedUID)=>{
        try{
            console.log(`Kicking ${kickedUID} by admin:${user.uid}`);
            const response = await axiosInstance.delete(`/groups/kick/${kickedUID}?groupId=${groupID}`); 
            if (response.status===200){
                console.log(response.data?.message);
                alert(response.data?.message);
                setMembers(response.data?.group?.members);
            }
        }
        catch(err){
            console.log(err);
            console.log(err.response?.data?.message);
        }

    }

    const renameGroup = async (newName) =>{
        try{
            console.log(`New group name: ${newName}`);
            const response = await axiosInstance.put(`/groups/${groupID}`, {name:newName, admin:user.uid}); 
            if (response.status===200){
                console.log(response.data.message);
                alert(response.data.message);
                setGroupName(newName);
            }
        }
        catch(err){
            console.log(err);
            console.log(err.response?.data?.message);
        }
    }

    const joinGroup = async ()=>{
        try{
            const payload = {groupId:groupID};
            const response = await axiosInstance.post(`/groups/join/${user.uid}`, payload); 
            if (response.status===200){
                console.log(response.data.message);
                alert(response.data.message);
            }
        }
        catch(err){
            console.log(err);
            console.log(err.response?.data?.message);
        }
    }

    const leaveGroup = async ()=>{
        try{
            if (creator===user.uid){
                deleteGroup();
                return;
            }
            const response = await axiosInstance.delete(`/groups/leave/${user.uid}?groupId=${groupID}`); 
            if (response.status===200){
                console.log(response.data.message);
                alert(response.data.message);
                setMembers(response.data?.group?.members);
            }
        }
        catch(err){
            console.log(err);
            console.log(err.response?.data?.message);
        }
    }

    const acceptMember = async(memberUID) =>{
        try{
            console.log(`Accepting ${memberUID} to group:${groupID}`);
            const payload = {groupId:groupID};
            const response = await axiosInstance.put(`/groups/accept/${memberUID}`, payload); 
            if (response.status===200){
                console.log(response.data.message);
                alert(response.data.message);
                setMembers(response.data?.group?.members);
                setJoinRequests(response.data?.group?.joinRequests);
            }
        }
        catch(err){
            console.log(err);
            console.log(err.response?.data?.message);
        }
    }

    const declineMember = async(memberUID) =>{
        try{
            console.log(`Rejecting ${memberUID}`);
            const payload = {groupId:groupID};
            const response = await axiosInstance.put(`/groups/decline/${memberUID}`, payload); 
            if (response.status===200){
                console.log(response.data.message);
                alert(response.data.message);
                setMembers(response.data?.group?.members);
                setJoinRequests(response.data?.group?.joinRequests);
            }
        }
        catch(err){
            console.log(err);
            console.log(err.response?.data?.message);
        }
    }

    const promoteMember = async(memberUID) =>{
        try{
            console.log(`Promoting ${memberUID} in group:${groupID}`);
            const payload = {groupId:groupID};
            const response = await axiosInstance.put(`/groups/promote/${memberUID}`, payload); 
            if (response.status===200){
                console.log(response.data.message);
                alert(response.data.message);
                setMembers(response.data?.group?.members);
                setAdmins(response.data?.group?.admins);
            }
        }
        catch(err){
            console.log(err);
            console.log(err.response?.data?.message);
        }
    }

    const updateUI = (newMembers)=>{
        setMembers(newMembers);
    }

    return (
        <div id="group-card">
          <div id="group-card-header">
            <div className="grouped">
                <img className="group-image" src={groupImage} alt="groupImage"/>
                <ScreenTitle title={groupName}/>
            </div>
            {isJoined() && (<button onClick={leaveGroup}>Leave</button>)}
          </div>
          <ul className="card-carousel">
            {membersAvatars && membersAvatars.map((avatar,index)=>{
                if (index<5){
                    return (  <li key={index} className="card-carousel-item">
                        <img className="group-member-avatar" src={avatar} alt="usersAvatar"/>
                    </li>);
                }
                else return null;
            }
            )}
          </ul>
          <div id="group-card-footer">
            { /*The logic here is basically: If not joined -> display Join. If joined, explore, if joined and admin, display manage/del*/
            !isJoined() 
            ? (<button onClick={joinGroup}>Join</button>)
            :(<div>
                <button onClick={(e)=>goTo(`/groups/feed/${groupID}`)}>Explore</button>
                <button onClick={(e)=>goTo(`/chat/${chatID}`)}>Chat</button>
                {isAdmin() && (<div className="grouped">
                <button onClick={() => openPopup()}>Manage</button>
                <button onClick={deleteGroup}>Delete</button>
                </div>)}
            </div> )}
          </div>
          <PopupModal isOpen={isPopupOpen} onClose={closePopup} styleId="invite-modal">
           <TabbedContent
                tabs={["New Name","Members", "Invite", "New Image"]}
                tabsContent={[
                    <ConfigureGroupWindow 
                        groupName={groupName} onRenameGroup={(newGroupName)=>renameGroup(newGroupName)} 
                        joinRequests={joinRequests} onAcceptInvite={acceptMember} onDeclineInvite={declineMember}/>,
                    <MembersListWindow self={user.uid} members={membersUsernames} membersAvatars={membersAvatars} 
                    admins={admins} removeMember={kickMember} onPromote={promoteMember}/>,
                    <InviteWindow onInviteFriend={(e, inviteMember)=>props.onInvite(e, inviteMember, groupID, updateUI)}/>,
                    <StatisticsNewImageWindow groupId={groupID} />
                ]}
                tabStyleId="manage-group-tabs"
           />

          </PopupModal>
        </div>
    );
}