import React from 'react'
import ProfileImage from '../../../../Assets/Images/profile.png'
import './profileBody.css'
import { FaPencil } from "react-icons/fa6";

const ProfileBody = () => {
    return (
        <div className="profileBodyMainComponent">
            <div className="profile-container">
                <img src={ProfileImage} alt="Profile Picture" />
                <div className="edit-icon-profile">
                    <FaPencil />
                </div>
            </div>

            <div className="email-container">
                <input type="email" className="email-input" placeholder="xyz@gmail.com" />
                <div className="edit-icon-email">
                    <FaPencil />
                </div>
            </div>

            <div className="password-container">
            <input type="password" className="password-input" placeholder="abc123" />
                <div className="edit-icon-password">
                    <FaPencil />
                </div>
            </div>
        </div>
    )
}

export default ProfileBody