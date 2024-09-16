import React, { useState } from 'react';
import './tabTruckOperations.css';
import Tab1TruckOperations from '../tab1_truck_operations/Tab1TruckOperations';
import Tab2TruckOperations from '../tab2_truck_operations/Tab2TruckOperations';
import Tab3TruckOperations from '../tab3_truck_operations/Tab3TruckOperations';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const TabsTruckOperations = ({user_details}) => {

    const [activeTab, setActiveTab] = useState('Operations');
    const [open, setOpen] = useState(false);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

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
                    {activeTab === 'Operations' && <div><Tab1TruckOperations user_details={user_details} set_backdrop={setOpen} /></div>}
                    {activeTab === 'Driver Profile' && <div><Tab2TruckOperations user_details={user_details} set_backdrop={setOpen} /></div>}
                    {activeTab === 'Driver Options' && <div><Tab3TruckOperations user_details={user_details} set_backdrop={setOpen} /></div>}
                </div>
            </div>
        </>
    );
};

export default TabsTruckOperations;
