import React, { useState } from 'react'
import './tabsVendorOperations.css'
import Tab1VendorOperations from '../tab1_vendor_operations/Tab1VendorOperations';
import Tab2VendorOperations from '../tab2_vendor_operations/Tab2VendorOperations';

const TabsVendorOperations = () => {
    const [activeTab, setActiveTab] = useState('CheckIn');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="tabs-container">
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'CheckIn' ? 'active' : ''}`}
                    onClick={() => handleTabClick('CheckIn')}
                >
                    Check In
                </button>
                <button
                    className={`tab ${activeTab === 'CheckOut' ? 'active' : ''}`}
                    onClick={() => handleTabClick('CheckOut')}
                >
                    Check Out
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'CheckIn' && <div><Tab1VendorOperations /></div>}
                {activeTab === 'CheckOut' && <div><Tab2VendorOperations /></div>}
            </div>
        </div>
    );
}

export default TabsVendorOperations