import React, { useState, useEffect } from 'react';
import './tab2TruckOperations.css';
import { MdDeleteForever } from 'react-icons/md';
import axios from 'axios';
import Swal from 'sweetalert2';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

let API_URL = 'http://localhost:5000/api/';

const Tab2TruckOperations = ({ set_backdrop, allDrivers, fetchAllDrivers }) => {

    const [modalOpen, setModalOpen] = useState(false);
    const [driverName, setDriverName] = useState('');
    const [currentDrivers, setCurrentDrivers] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;
    const totalPages = Math.ceil(allDrivers.length / rowsPerPage);
    const userDetails = localStorage.getItem('user_details')
    const token = localStorage.getItem('token')

    useEffect(() => {

        // setCurrentDrivers(
        //     allDrivers ? allDrivers?.slice(
        //         (currentPage - 1) * rowsPerPage,
        //         currentPage * rowsPerPage
        //     ) : []
        // )

        // Listen for driverAdded event
        socket.on('driverAdded', (newDriver) => {
            console.log('Driver added:', newDriver);
            fetchAllDrivers();
        });

        // Listen for driverUpdated event
        socket.on('driverUpdated', (updatedDriver) => {
            console.log('Driver updated:', updatedDriver);
            fetchAllDrivers();
        });

        // Listen for driverUpdated event
        socket.on('driverReinstated', (updatedDriver) => {
            console.log('Driver Reinstated:', updatedDriver);
            fetchAllDrivers();
        });

        // Listen for driverDeleted event
        socket.on('driverDeleted', (deletedDriver) => {
            console.log('Driver Deleted:', deletedDriver);
            fetchAllDrivers();
        });

        // Listen for addOperataion event
        socket.on('operationAdded', (operation) => {
            console.log('Operation Added:', operation);
            fetchAllDrivers();
        });

        // Listen for reassignedOperataion NA event
        socket.on('driverReassignedNA', (operationId, driver, noDriverTimeCount, message) => {
            console.log('ReAssigned NA Operation:', operationId, driver, noDriverTimeCount, message);
            fetchAllDrivers();
        });

        // Listen for reassignedOperataion event
        socket.on('driverReassigned', (operationId, newDriver, assignedAt, totalTimeCount, noDriverTime) => {
            console.log('ReAssigned Operation:', operationId, newDriver, assignedAt, totalTimeCount, noDriverTime);
            fetchAllDrivers();
        });

        // Cleanup on unmount
        return () => {
            socket.off('driverAdded');
            socket.off('driverUpdated');
            socket.off('driverReinstated');
            socket.off('driverDeleted');
        };
    }, []);

    const handleAddDriver = () => {
        if (driverName.trim()) {
            // set_backdrop(true);
            const payload = {
                driverName: driverName,
            };
            console.log('Payload:', payload);
            axios.post(API_URL + 'driver/add', payload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((response) => {
                if (response.status === 201) {
                    const resp = response.data;
                    setDriverName('');
                    setModalOpen(false);
                }
            }).catch((error) => {
                console.error("Error", error.response ? error.response.data : error.message);
                setDriverName('');
                setModalOpen(false);
                alert("Error occurred while adding the driver");
            });
        }
    };

    const handleDeleteDriver = (driver) => {
        if (driver.status === "busy") {
            return alert("Driver is busy already, can't delete");
        }
        if (driver.status === "deleted") {
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
                    axios.delete(API_URL + `driver/delete/${driver._id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }).then((response) => {
                        if (response.data) {
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
            axios.patch(API_URL + `driver/status/${driver._id}`, { status: 'deleted' }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            }).then((response) => {
                console.log('reposen', response)
                if (response.data) {
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
        axios.patch(API_URL + `driver/reinstate/${driver._id}`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((response) => {
            if (response.data) {
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

            {allDrivers?.length > 0 && (
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
                            {allDrivers.map((driver, index) => (
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
                    <div className='paginationButtonMain'>
                        <button
                            className='paginationButtonNext'
                            onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                            disabled={currentPage === 1 || allDrivers?.length <= rowsPerPage}
                        >
                            Previous
                        </button>
                        <button
                            className='paginationButtonPrev'
                            onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                            disabled={currentPage === totalPages || allDrivers?.length <= rowsPerPage}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tab2TruckOperations;