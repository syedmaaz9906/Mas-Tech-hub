import React, { useState,useEffect } from 'react';
import './tabTruckOperations.css';
import Tab1TruckOperations from '../tab1_truck_operations/Tab1TruckOperations';
import Tab2TruckOperations from '../tab2_truck_operations/Tab2TruckOperations';
import Tab3TruckOperations from '../tab3_truck_operations/Tab3TruckOperations';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { io } from 'socket.io-client';

const TabsTruckOperations = () => {

    const [activeTab, setActiveTab] = useState('Operations');
    const [open, setOpen] = useState(false);
    const [allDrivers, setAllDrivers] = useState([]);
    const token = localStorage.getItem('token')
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const fetchAllDrivers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/driver/all', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            setAllDrivers(response.data.data);
        } catch (error) {
            // console.error('Error fetching drivers:', error);
        }
    };

    useEffect(() => {
      fetchAllDrivers();
    }, [])
    

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className="tabs-container">
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'Operations' ? 'active' : ''}`}
                        onClick={() => handleTabClick('Operations')}
                    >
                        Operations
                    </button>
                    <button
                        className={`tab ${activeTab === 'Driver Profile' ? 'active' : ''}`}
                        onClick={() => handleTabClick('Driver Profile')}
                    >
                        Driver Profile
                    </button>
                    <button
                        className={`tab ${activeTab === 'Driver Options' ? 'active' : ''}`}
                        onClick={() => handleTabClick('Driver Options')}
                    >
                        Completed Operations
                    </button>
                </div>
                <div className="tab-content">
                    {activeTab === 'Operations' && <div><Tab1TruckOperations set_backdrop={setOpen} allDrivers={allDrivers} fetchAllDrivers={fetchAllDrivers} /></div>}
                    {activeTab === 'Driver Profile' && <div><Tab2TruckOperations set_backdrop={setOpen} allDrivers={allDrivers} fetchAllDrivers={fetchAllDrivers} /></div>}
                    {activeTab === 'Driver Options' && <div><Tab3TruckOperations set_backdrop={setOpen} /></div>}
                </div>
            </div>
        </>
    );
};

export default TabsTruckOperations;
