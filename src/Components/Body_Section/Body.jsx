import React from 'react';
import './body.css';
import Top from './Top_Section/Top';
import Home from '../Home_Section/Home';
import Truck from '../Truck_Section/Truck';
import Vendor from '../Vendor_Section/Vendor';
import Csvdata from '../CsvData_Section/Csvdata';
import Profile from '../Profile_Section/Profile';
import AdminOperations from '../AdminOperations_Section/AdminOperations';

const Body = ({ activeItem, user_details, set_token }) => {
    return (
        <div className='mainContent'>
            <Top set_token={set_token} user_details={user_details} />
            {activeItem === 'home' && <Home />}
            {activeItem === 'truck' && <Truck user_details={user_details} />}
            {activeItem === 'vendor' && <Vendor />}
            {activeItem === 'csvdata' && <Csvdata />}
            {activeItem === 'profile' && <Profile />}
            {activeItem === 'adminOperations' && <AdminOperations user_details={user_details} />}
        </div>
    );
};

export default Body;
