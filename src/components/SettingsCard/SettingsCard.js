import { useContext, useEffect, useState } from "react";

import axiosInstance from "../../axiosInstance";
import { userContext } from "../../UserProvider";
import { findUserNameDB, writeToDB } from "../../firebase/ReadWriteDB";


import ScreenTitle from "../base-components/ScreenTitle/ScreenTitle";
import TabbedContent from "../base-components/TabbedContent/TabbedContent";
import Field from "../base-components/Field/Field";
import ImageSelector from "../base-components/ImageSelector/ImageSelector";
import "./SettingsCard.css"
import FormField from "../base-components/FormField/FormField";
import { updatePassword } from "firebase/auth";




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
                console.log(`userName: ${userName}`);
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
                setNewUserName("");
                setDisplayUserName(newUserName);
            }
            catch(err){
                console.log(err);
                console.log(err.response?.data?.message);
            }
        }

        const changePassword = async ()=>{
            try{
                if(newPassword==="" || confirmPassword==="") return;
                if(newPassword!==confirmPassword) return alert("Passwords do not match.");
                await updatePassword(user, newPassword);
                alert("Password changed successfully.");
                setNewPassword("");
                setConfirmPassword("");
            }
            catch(err){
                console.log(err);
                console.log(err.response?.data?.message);
            }
        }
    

        const onSubmit = async(e, type)=>{
            e.preventDefault();
            if(type==="primary"){
                await changeProfilePic();
                await changeUserName();
            }
            else if(type==="credentials"){
                await changePassword();
            }
        }


    return(
        <div className="center-container  settings-card">
            <ScreenTitle designClass="settings-title"title="User Settings"/>
            <section className="user-primary-info">
                <img className="settings-avatar" alt="avatar" src={avatar}/>
                <ScreenTitle designClass="settings-user-name" title={displayUserName} />
                <button className="submit-button change-primary-btn">Change</button>
            </section>
            <div className="settings-divider"/>
            <section className="credentials-change">
                <ScreenTitle designClass="settings-user-name" title="Change Credentials"/>
                <button className="submit-button change-credentials-btn">Change</button>
            </section>
            <div className="settings-divider"/>
            <TabbedContent tabs={["Primary","Credentials"]} tabsContent={[
                <form className="primary-details-form">
                    <Field type="text" value={newUserName} onChange={(e)=>setNewUserName(e.target.value)} prompt="New Username" />
                    <ImageSelector onSelectImage={(image)=>setNewProfilePic(image)}/>
                    <button className="submit-button" onClick={(e)=>onSubmit(e, "primary")}>Submit</button>
                </form>,
                <form className="credentials-form">
                    <FormField type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} prompt="New Password" />
                    <FormField type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} prompt="Confirm Password" />
                    <button className="submit-button" onClick={(e)=>onSubmit(e, "credentials")}>Submit</button>
                </form>  
                ]}/>
            <div className="settings-divider"/>
            <section className="delete-account">
                <span>Delete Account</span>
                <button className="submit-button delete-btn">Delete</button>
            </section>

        </div>
    );
}