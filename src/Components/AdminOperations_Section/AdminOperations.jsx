import React, { useEffect, useState } from 'react'
import './adminOperations.css'
import AdminOperationsBody from './components/AdminOperations_Body/AdminOperationsBody'
import axios from 'axios';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

let API_URL = 'https://backend.srv533347.hstgr.cloud/';
const AdminOperations = ({ user_details }) => {

    const [open, setOpen] = useState(true);
    const [user_data, setUserData] = useState([]);

    useEffect(() => {

        axios.get(API_URL + 'get_accounts_info', {
            params: {
                account_type: user_details.Role
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            setOpen(false)
            setUserData(response.data)
        })
            .catch(err => {setOpen(false); console.warn(err)});
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
                {!open && <AdminOperationsBody user_data={user_data} set_user_data={setUserData} />}
            </div>
        </div>
    )
}

export default AdminOperations