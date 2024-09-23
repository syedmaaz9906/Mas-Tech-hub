import React, { useEffect, useState } from 'react'
import './adminOperations.css'
import AdminOperationsBody from './components/AdminOperations_Body/AdminOperationsBody'
import axios from 'axios';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

let API_URL = 'http://localhost:5000/api/';

const AdminOperations = () => {

    const [open, setOpen] = useState(true);
    const [userData, setUserData] = useState([]);

    const userDetails = JSON.parse(localStorage.getItem('user_details'))
    const token = localStorage.getItem('token')

    useEffect(() => {
        axios.get(API_URL + 'user/get_accounts_info', {
            params: {
                account_type: userDetails.role
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((response) => {
            setOpen(false)
            setUserData(response?.data)
        })
            .catch(err => { setOpen(false); console.warn(err) });
    }, []);

    return (
        <div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className='adminOperationsMain'>
                <div className="adminOperationsTitle">
                    <h2>Admin Operations</h2>
                </div>
            </div>

            <div className='adminOperationsBodyMain'>
                {!open && <AdminOperationsBody user_data={userData} set_user_data={setUserData} />}
            </div>
        </div>
    )
}

export default AdminOperations