import React, { useState, useEffect } from 'react';
import './tab2TruckOperations.css';
import { MdDeleteForever } from 'react-icons/md';
import axios from 'axios';
import Swal from 'sweetalert2';

let API_URL = 'https://backend.srv533347.hstgr.cloud/';
const Tab2TruckOperations = ({ user_details, set_backdrop }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [driverName, setDriverName] = useState('');
    const [drivers, setDrivers] = useState([]);

    useEffect(() => {
        set_backdrop(true);
        axios.get(API_URL + 'get_truck_drivers', {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            set_backdrop(false);
            setDrivers(response.data);
            console.log(response.data);
        })
            .catch(err => { set_backdrop(false); console.warn(err); });
    }, []);

    const handleAddDriver = () => {
        if (driverName.trim()) {
            set_backdrop(true);
            axios.post(API_URL + 'add_driver', {
                driverName: driverName,
                accountID: user_details.ID
            }).then((response) => {
                if (response.status === 200) {
                    const resp = response.data;
                    set_backdrop(false);
                    const updatedDrivers = [...drivers, resp];
                    setDrivers(updatedDrivers);
                    setDriverName('');
                    setModalOpen(false);
                }
            }).catch((error) => {
                console.log("Error", error);
                set_backdrop(false);
                setDriverName('');
                setModalOpen(false);
                alert("Error");
            });
        }
    };

    const handleDeleteDriver = (driver) => {
        if (driver.DriverStatus === "placed"){
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
                            id: driver.DriverID,
                            status: driver.DriverStatus
                        }
                    }).then((response) => {
                        if (response.data) {
                            setDrivers(drivers.filter(row => row.DriverID !== driver.DriverID));
                            set_backdrop(false);
                            Swal.fire({
                                title: "Deleted!",
                                text: "User has been deleted.",
                                icon: "success"
                            });
                        } else {
                            console.log(response.data);
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
            axios.delete(API_URL + 'delete_driver', {
                params: {
                    id: driver.DriverID,
                    status: driver.DriverStatus
                }
            }).then((response) => {
                if (response.data) {
                    setDrivers(drivers.map(row => {
                        if (row.DriverID === driver.DriverID) {
                            row.DriverStatus = "deleted";
                        }
                        return row;
                    }));
                    set_backdrop(false);
                } else {
                    console.log(response.data);
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
        axios.put(API_URL + 'reinstate_driver', {
            id: driver.DriverID
        }).then((response) => {
            if (response.data) {
                setDrivers(drivers.map(row => {
                    if (row.DriverID === driver.DriverID) {
                        row.DriverStatus = "available";
                    }
                    return row;
                }));
                set_backdrop(false);
            } else {
                console.log(response.data);
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
                                {user_details.Role !== "volunteer" && <th>Delete</th>}
                                {user_details.Role !== "volunteer" && <th>Reinstate</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {drivers.map((driver, index) => (
                                <tr key={index}>
                                    <td>{driver.DriverName}</td>
                                    <td>{driver.RequestNumber || 'N/A'}</td>
                                    <td>{driver.BoothLocation || 'N/A'}</td>
                                    <td>{driver.TruckLocation || 'N/A'}</td>
                                    <td>{driver.DriverStatus || 'N/A'}</td>
                                    {user_details.Role !== "volunteer" && <td>
                                        <MdDeleteForever className='deleteIconTable' onClick={() => handleDeleteDriver(driver)} />
                                    </td>}
                                    {user_details.Role !== "volunteer" && <td>
                                        {driver.DriverStatus === "deleted" && (
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
