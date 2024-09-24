import React, { useState, useEffect } from 'react';
import './tab2TruckOperations.css';
import { MdDeleteForever } from 'react-icons/md';
import axios from 'axios';
import Swal from 'sweetalert2';

let API_URL = 'http://localhost:5000/api/';

const Tab2TruckOperations = ({ set_backdrop }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [driverName, setDriverName] = useState('');
    const [drivers, setDrivers] = useState([]);

    const userDetails = localStorage.getItem('user_details')
    const token = localStorage.getItem('token')

    useEffect(() => {
        set_backdrop(true);
        axios.get(API_URL + 'driver/all', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((response) => {
            set_backdrop(false);
            setDrivers(response.data.data);
        })
            .catch(err => { set_backdrop(false); console.warn(err); });
    }, []);

    const handleAddDriver = () => {

        if (driverName.trim()) {
            set_backdrop(true);

            const payload = {
                driverName: driverName,
                accountID: JSON.parse(userDetails).id
            };

            console.log('Payload:', payload);

            axios.post(API_URL + 'driver/add', payload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((response) => {
                if (response.status === 201) {
                    const resp = response.data;
                    console.log('qwdqwdqwdqwdqwdqwd', resp)
                    set_backdrop(false);
                    const updatedDrivers = [...drivers, resp];
                    setDrivers(updatedDrivers);
                    setDriverName('');
                    setModalOpen(false);
                }
            }).catch((error) => {
                console.error("Error", error.response ? error.response.data : error.message);
                set_backdrop(false);
                setDriverName('');
                setModalOpen(false);
                alert("Error occurred while adding the driver");
            });
        }
    };

    const handleDeleteDriver = (driver) => {
        if (driver.DriverStatus === "placed") {
            return alert("Driver is placed already, can't delete");
        }
        if (driver.DriverStatus === "deleted") {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    set_backdrop(true);
                    axios.delete(API_URL + 'delete_driver', {
                        params: {
                            id: driver._id,
                            status: driver.status
                        }
                    }).then((response) => {
                        if (response.data.data) {
                            setDrivers(drivers.filter(row => row._id !== driver._id));
                            set_backdrop(false);
                            Swal.fire({
                                title: "Deleted!",
                                text: "User has been deleted.",
                                icon: "success"
                            });
                        } else {
                            console.log(response.data.data);
                            set_backdrop(false);
                        }
                    }).catch((err) => {
                        console.log(err);
                        set_backdrop(false);
                    });
                }
            });
        } else {
            set_backdrop(true);
            axios.delete(API_URL + 'driver/delete', {
                params: {
                    id: driver._id,
                    status: driver.status
                }
            }).then((response) => {
                if (response.data.data) {
                    setDrivers(drivers.map(row => {
                        if (row._id === driver._id) {
                            row.status = "deleted";
                        }
                        return row;
                    }));
                    set_backdrop(false);
                } else {
                    console.log(response.data.data);
                    set_backdrop(false);
                }
            }).catch((err) => {
                console.log(err);
                set_backdrop(false);
            });
        }
    };

    const handleReinstateDriver = (driver) => {
        set_backdrop(true);
        axios.put(API_URL + 'driver/reinstate', {
            id: driver._id
        }).then((response) => {
            if (response.data.data) {
                setDrivers(drivers.map(row => {
                    if (row._id === driver._id) {
                        row.status = "available";
                    }
                    return row;
                }));
                set_backdrop(false);
            } else {
                console.log(response.data.data);
                set_backdrop(false);
            }
        }).catch((err) => {
            console.log(err);
            set_backdrop(false);
        });
    };

    return (
        <div className='tabMainContainer'>
            <div className='btn-driver-profile-main'>
                <button className='btn-driver-profile' onClick={() => setModalOpen(true)}>
                    <p>Add a driver</p>
                </button>
            </div>

            {modalOpen && (
                <div className='modal-truck'>
                    <div className='modal-content'>
                        <span className='close' onClick={() => setModalOpen(false)}>&times;</span>
                        <h2>Add Driver</h2>
                        <input
                            type="text"
                            value={driverName}
                            onChange={(e) => setDriverName(e.target.value)}
                            placeholder="Enter driver name"
                        />
                        <div className='btn-driver-profile-main-modal'>
                            <button className='btn-driver-profile-modal-add' onClick={handleAddDriver}>Add Driver</button>
                            <button className='btn-driver-profile-modal-cancel' onClick={() => setModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {drivers.length > 0 && (
                <div className='table-container'>
                    <table className='drivers-table'>
                        <thead>
                            <tr>
                                <th>Driver's Name</th>
                                <th>Request Number</th>
                                <th>Booth Location</th>
                                <th>Truck Location</th>
                                <th>Status</th>
                                {userDetails.role !== "volunteer" && <th>Delete</th>}
                                {userDetails.role !== "volunteer" && <th>Reinstate</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {drivers.map((driver, index) => (
                                <tr key={index}>
                                    <td>{driver.name}</td>
                                    <td>{driver.requestNumber || 'N/A'}</td>
                                    <td>{driver.boothLocation || 'N/A'}</td>
                                    <td>{driver.truckLocation || 'N/A'}</td>
                                    <td>{driver.status || 'N/A'}</td>
                                    {userDetails.role !== "volunteer" && <td>
                                        <MdDeleteForever className='deleteIconTable' onClick={() => handleDeleteDriver(driver)} />
                                    </td>}
                                    {userDetails.role !== "volunteer" && <td>
                                        {driver.status === "deleted" && (
                                            <button className='reinstateDriverButton' onClick={() => handleReinstateDriver(driver)}>Reinstate</button>
                                        )}
                                    </td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Tab2TruckOperations;
