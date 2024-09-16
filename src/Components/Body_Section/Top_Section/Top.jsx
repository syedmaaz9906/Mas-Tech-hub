import React from 'react'
import './top.css'

// Imported Icons
import { BiSearchAlt } from "react-icons/bi";
import { MdOutlineEmail } from "react-icons/md";
import { RiLogoutCircleLine } from "react-icons/ri";

// Imported Images
import img from '../../../Assets/Images/profile.png'
import { useNavigate } from 'react-router-dom';

const Top = ({ set_token, user_details }) => {

    const navigate = useNavigate()
    const logoutAccount = () => {
        localStorage.clear();
        set_token(null);
        navigate('/signin');
    }
    return (
        <div className='topSection'>
            <div className="headerSection flex">
                <div className="title">
                    <h1>Welcome to Mas Tech Hub</h1>
                    <p>Hello {user_details.Name.split(" ")[0]}, Welcome back!</p>
                </div>

                {/* <div className="searchBar flex">
                    <input type="text" placeholder='Search Dashboard' />
                    <BiSearchAlt className='icon' />
                </div> */}

                <div className="adminDiv flex">

                    <span title='Email Us'>
                        <MdOutlineEmail className='icon' />
                    </span>

                    <span title='Logout'>
                        <RiLogoutCircleLine className='icon' onClick={logoutAccount} />
                    </span>


                    <span title='My Profile'>
                        <div className="adminImage">
                            <img src={img} alt="Admin Image" />
                        </div>
                    </span>

                </div>
            </div>
        </div>
    )
}

export default Top