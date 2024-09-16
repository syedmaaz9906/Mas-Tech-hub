import React, { useState } from 'react';
import './sidebar.css';
import { Link, useNavigate } from 'react-router-dom';

// Imported Images
import logo from '../../Assets/Images/logo.png'

// Imported Icons
import { RiDashboardFill } from "react-icons/ri";
import { FaFolder, FaTruck } from "react-icons/fa";
import { FaClockRotateLeft } from 'react-icons/fa6';
import { BsQuestionCircle } from "react-icons/bs";
import { FaUserAlt } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { MdAdminPanelSettings } from "react-icons/md";

const Sidebar = ({ activeItem, setActiveItem, user_details, set_token }) => {
    const handleItemClick = (itemName) => {
        setActiveItem(itemName);
    };

    const navigate = useNavigate()
    const logoutAccount = () => {
        localStorage.clear();
        set_token(null);
        navigate('/signin');
    }

    return (
        <div className='sideBar grid'>
            <div className="logoDiv flex">
                <img src={logo} alt="Image Name" />
                <h2>Mas Tech Hub</h2>
            </div>

            <div className="menuDiv">
                <h3 className="divTitle">
                    QUICK MENU
                </h3>

                <ul className="menuLists grid">

                    <li className={`listItem ${activeItem === 'home' ? 'active' : ''}`}>
                        <Link to="#" className='menuLink flex' onClick={() => handleItemClick('home')}>
                            <RiDashboardFill className='icon' />
                            <span className="smallText">Home</span>
                        </Link>
                    </li>

                    <li className={`listItem ${activeItem === 'truck' ? 'active' : ''}`}>
                        <Link to="#" className='menuLink flex' onClick={() => handleItemClick('truck')}>
                            <FaTruck className='icon' />
                            <span className="smallText">Truck Operations</span>
                        </Link>
                    </li>

                    <li className={`listItem ${activeItem === 'vendor' ? 'active' : ''}`}>
                        <Link to="#" className='menuLink flex' onClick={() => handleItemClick('vendor')}>
                            <FaClockRotateLeft className='icon' />
                            <span className="smallText">Vendor Check In/Out</span>
                        </Link>
                    </li>

                    {/* <li className={`listItem ${activeItem === 'csvdata' ? 'active' : ''}`}>
                        <Link to="#" className='menuLink flex' onClick={() => handleItemClick('csvdata')}>
                            <FaFolder className='icon' />
                            <span className="smallText">Combine CSV Data</span>
                        </Link>
                    </li> */}

                </ul>
            </div>

            {/* CREATE IF MORE THINGS ARE WANTED */}
            <div className="settingsDiv">
                <h3 className="divTitle">
                    SETTINGS
                </h3>

                <ul className="menuLists grid">

                    <li className={`listItem ${activeItem === 'profile' ? 'active' : ''}`}>
                        <Link to="#" className='menuLink flex' onClick={() => handleItemClick('profile')}>
                            <FaUserAlt className='icon' />
                            <span className="smallText">Profile</span>
                        </Link>
                    </li>

                    {user_details.Role!=="volunteer" && <li className={`listItem ${activeItem === 'adminOperations' ? 'active' : ''}`}>
                        <Link to="#" className='menuLink flex' onClick={() => handleItemClick('adminOperations')}>
                            <MdAdminPanelSettings className='icon' />
                            <span className="smallText">Admin Operations</span>
                        </Link>
                    </li>}

                    <li className={`listItem`}>
                        <Link to="#" className='menuLink flex' onClick={logoutAccount}>
                            <MdLogout className='icon' />
                            <span className="smallText">Logout</span>
                        </Link>
                    </li>

                </ul>
            
            </div>

            <div className="sideBarCard">
                <BsQuestionCircle className='icon' />
                <div className="cardContent">
                    <div className="circle1"></div>
                    <div className="circle2"></div>

                    <h3>Help Center</h3>
                    <p>Having trouble in Tech Hub, please contact us for more questions.</p>

                    <button className='btn'>
                        Go to help center
                    </button>
                </div>
            </div>

        </div>
    )
}

export default Sidebar