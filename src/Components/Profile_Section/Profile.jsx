import React from 'react'
import './profile.css'
import ProfileBody from './components/Profile_Body/ProfileBody'

const Profile = () => {
    return (
        <div>
            <div className='profileMain'>
                <div className="profileTitle">
                    <h2>Profile Page</h2>
                </div>
            </div>


            <div className='profileBodyMain'>
                <ProfileBody />
            </div>
        </div>
    )
}

export default Profile