import React from 'react'
import ProfileImage from '../../../../Assets/Images/profile.png'
import './profileBody.css'
import { FaPencil } from "react-icons/fa6";

const ProfileBody = () => {
    return (
        <div class="profileBodyMainComponent">
            <div class="profile-container">
                <img src={ProfileImage} alt="Profile Picture" />
                <div class="edit-icon-profile">
                    <FaPencil />
                </div>
            </div>

            <div className="email-container">
                <input type="email" className="email-input" placeholder="xyz@gmail.com" />
                <div class="edit-icon-email">
                    <FaPencil />
                </div>
            </div>

            <div class="password-container">
            <input type="password" className="password-input" placeholder="abc123" />
                <div class="edit-icon-password">
                    <FaPencil />
                </div>
            </div>
        </div>
    )
}

export default ProfileBody