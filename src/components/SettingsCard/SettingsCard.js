import { useContext, useEffect, useState } from "react";

import axiosInstance from "../../axiosInstance";
import { userContext } from "../../UserProvider";
import { findUserNameDB, writeToDB } from "../../firebase/ReadWriteDB";


import ScreenTitle from "../base-components/ScreenTitle/ScreenTitle";
import Field from "../base-components/Field/Field";
import ImageSelector from "../base-components/ImageSelector/ImageSelector";
import "./SettingsCard.css"
import FormField from "../base-components/FormField/FormField";
import { updatePassword } from "firebase/auth";
import SettingItem from "../SettingItem/SettingItem";




export default function SettingsCard(props){

    const {user, avatar} = useContext(userContext);
    const [newProfilePic, setNewProfilePic] = useState(null);
    const [newUserName, setNewUserName] = useState("");
    const [displayUserName, setDisplayUserName] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(()=>{
        const fetchUsername = async ()=>{
            try{
                const userName = await findUserNameDB(user.uid);
                setDisplayUserName(userName);
            }
            catch(err){
                console.log(err);
            }
        }

        fetchUsername();
    },[user]);

    const changeProfilePic = async ()=>{
        try{
            if(newProfilePic===null) return;
            const formData = new FormData();
            formData.append("image", newProfilePic);
            formData.append("filePath" ,"/pfps")
            const response = await axiosInstance.post("/upload/image", formData);
            if (response.status===201){
                console.log(response.data.message);
                await writeToDB(`/users/${user.uid}/settings/avatar`, response.data.file._id);
                alert("Profile picture changed successfully.");
                }
            }
            catch(err){
                console.log(err);
                console.log(err.response?.data?.message);
            }
            
        }

        const changeUserName = async ()=>{
            try{
                if(newUserName==="") return;
                await writeToDB(`/users/${user.uid}/settings/username`, newUserName);
                alert("Username changed successfully.");
                setDisplayUserName(newUserName);
                setNewUserName("");
            }
            catch(err){
                console.log(err);
                console.log(err.response?.data?.message);
            }
        }

        const changePassword = async ()=>{
            try{
                if(newPassword==="" || confirmPassword==="") return;
                if(newPassword!==confirmPassword) {
                    alert("Passwords do not match.");
                    return;
                }
                await updatePassword(user, newPassword);
                alert("Password changed successfully.");
                setNewPassword("");
                setConfirmPassword("");
            }
            catch(err){
                console.log(err);
                alert(err.response?.data?.message || err.message);
            }
        }

        const deleteAccount = async () => {
            alert("This functionality is not yet implemented.");
        }

    return(
        <div className="settings-card">
            <ScreenTitle designClass="settings-title" title="User Settings"/>
            <div className="settings-user-info">
                <img className="settings-avatar" alt="avatar" src={avatar}/>
                <h2 className="settings-user-name">{displayUserName}</h2>
            </div>
            
            <SettingItem
                title="Change Username"
                description="This will be the name other users see on your posts and profile."
            >
                <Field type="text" value={newUserName} onChange={(e)=>setNewUserName(e.target.value)} prompt="New Username" />
                <button className="submit-button" onClick={changeUserName}>Save</button>
            </SettingItem>

            <SettingItem
                title="Change Profile Picture"
                description="Upload a new avatar. Recommended aspect ratio is 1:1."
            >
                <ImageSelector onSelectImage={(image)=>setNewProfilePic(image)}/>
                <button className="submit-button" onClick={changeProfilePic}>Save</button>
            </SettingItem>

            <SettingItem
                title="Change Password"
                description="Choose a strong password to keep your account secure."
            >
                <div className="setting-control vertical">
                    <FormField type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} prompt="New Password" />
                    <FormField type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} prompt="Confirm Password" />
                    <button className="submit-button" onClick={changePassword}>Save</button>
                </div>
            </SettingItem>

            <SettingItem
                title="Delete Account"
                description="Permanently delete your account, posts, and all other data. This action is irreversible."
                danger={true}
            >
                <button className="submit-button delete-btn" onClick={deleteAccount}>Delete Account</button>
            </SettingItem>
        </div>
    );
}