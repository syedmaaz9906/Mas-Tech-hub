import React, { useState, useEffect } from 'react';
import './tab1TruckOperations.css';
import { MdDeleteForever, MdRestore } from "react-icons/md";
import { SiDavinciresolve } from "react-icons/si";
import axios from 'axios';
import Swal from 'sweetalert2';
import { io } from 'socket.io-client';
import TimerCell from './componentsTruck1/componentsTruck1';
import DriverAssignedTimer from './componentsTruck1/driverTimer';
import NoDriverTimer from './componentsTruck1/reAssignedTimeCount';

const socket = io(process.env.SOCKET_URL);

let API_URL = process.env.API_URL;

const Tab1TruckOperations = ({ set_backdrop, allDrivers, fetchAllDrivers, operations, fetchOperations, fetchResolvedOperations }) => {

    const [formData, setFormData] = useState({
        truckLocation: '',
        boothLocation: '',
        request: '',
        notes: '',
        assignedDriver: '',
        priority: '',
    });
    const [drivers, setDrivers] = useState([]);
    const token = localStorage.getItem('token');

    const fetchDrivers = async () => {
        try {
            const response = await axios.get(process.env.API_URL + 'driver/all?status=available', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            setDrivers(response.data.data);
        } catch (error) {
            console.error('Error fetching drivers:', error);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchDrivers();
        fetchOperations();

        // Listen for driverAdded event
        socket.on('driverAdded', (newDriver) => {
            console.log('Driver added:', newDriver);
            fetchDrivers();
            fetchAllDrivers();
        });

        // Listen for driverUpdated event
        socket.on('driverUpdated', (updatedDriver) => {
            console.log('Driver updated:', updatedDriver);
            fetchDrivers();
            fetchAllDrivers();
        });

        // Listen for driverUpdated event
        socket.on('driverReinstated', (updatedDriver) => {
            console.log('Driver Reinstated:', updatedDriver);
            fetchDrivers();
            fetchAllDrivers();
        });

        // Listen for driverDeleted event
        socket.on('driverDeleted', (deletedDriver) => {
            console.log('Driver Deleted:', deletedDriver);
            fetchDrivers();
            fetchAllDrivers();
        });

        // Listen for addOperataion event
        socket.on('operationAdded', (operation) => {
            console.log('Operation Added:', operation);
            fetchOperations();
            fetchDrivers();
            fetchAllDrivers();
        });

        // Listen for reassignedOperataion NA event
        socket.on('driverReassignedNA', (operationId, driver, noDriverTimeCount, message) => {
            console.log('ReAssigned NA Operation:', operationId, driver, noDriverTimeCount, message);
            fetchOperations();
            fetchDrivers();
            fetchAllDrivers();
        });

        // Listen for reassignedOperataion event
        socket.on('driverReassigned', (operationId, newDriver, assignedAt, totalTimeCount, noDriverTime) => {
            console.log('ReAssigned Operation:', operationId, newDriver, assignedAt, totalTimeCount, noDriverTime);
            fetchOperations();
            fetchDrivers();
            fetchAllDrivers();
        });

        // Listen for operationUpdated event
        socket.on('operationUpdated', (updatedOperation) => {
            console.log('Updated Operation:', updatedOperation);
            fetchOperations();
            fetchResolvedOperations();
        });

        // Listen for operationDeleted event
        socket.on('operationDeleted', (deletedOperation) => {
            console.log('Deleted Operation:', deletedOperation);
            fetchOperations();
            fetchDrivers();
            fetchAllDrivers();
        });

        // Listen for operationReinstated event
        socket.on('operationReinstated', (updatedOperation) => {
            console.log('Reinstated Operation:', updatedOperation);
            fetchOperations();
        });

        // Listen for operationReinstated event
        socket.on('operationResolved', (updatedOperation) => {
            console.log('Reinstated Operation:', updatedOperation);
            fetchOperations();
            fetchDrivers();
            fetchAllDrivers();
            fetchResolvedOperations();
        });

        // Cleanup on unmount
        return () => {
            socket.off('driverAdded');
            socket.off('driverUpdated');
            socket.off('driverReinstated');
            socket.off('driverDeleted');
            socket.off('operationAdded');
            socket.off('driverReassignedNA');
            socket.off('driverReassigned');
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const reAssignDriver = (e, operationId) => {
        set_backdrop(true);  // Show loading indicator
        const newDriverId = e.target.value === "" ? null : e.target.value;

        console.log(newDriverId, operationId)

        // Update the operation in the backend
        axios.post(API_URL + 'operation/reassignDriver', { driverId: newDriverId, operationId: operationId }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((response) => {
            set_backdrop(false);

        }).catch((error) => {
            console.log("Error", error);
            alert("Error occurred while reassigning the driver, please try again!");
            set_backdrop(false);
        });
    };

    const addOperation = () => {
        const operationData = {
            truckLocation: formData.truckLocation,
            boothLocation: formData.boothLocation,
            request: formData.request,
            notes: formData.notes,
            assignedDriver: formData.assignedDriver,
            priority: formData.priority,
        };
        set_backdrop(true);
        axios.post(API_URL + 'operation/add', operationData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((response) => {
            if (response.status === 200) {
                setFormData({
                    truckLocation: '',
                    boothLocation: '',
                    request: '',
                    notes: '',
                    assignedDriver: '',
                    priority: '',
                });
                set_backdrop(false);
            }
            set_backdrop(false);
        }).catch((error) => {
            console.log("Error", error);
            alert("Error occurred while adding the operation, fields cannot be empty!");
            set_backdrop(false);
        })
    };

    const handlePriorityChange = (e, operationID) => {
        axios.patch(API_URL + `operation/priority/${operationID}`, { priority: e.target.value }, {
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

    const reinstateOperation = (operation) => {
        console.log(operation)
        axios.patch(API_URL + `operation/reinstate/${operation._id}`, { status: 'deleted' }, {
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
    };

    const deleteOperation = (operation) => {
        console.log(operation)
        if (operation.status === 'deleted') {
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
                    axios.delete(API_URL + `operation/delete/${operation._id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                    }).then((response) => {
                        if (response.data) {
                            set_backdrop(false);
                            Swal.fire({
                                title: "Deleted!",
                                text: "Operation has been deleted.",
                                icon: "success"
                            });
                        } else {
                            // console.log(response.data);
                            set_backdrop(false);
                        }
                    }).catch((err) => {
                        console.log(err);
                        set_backdrop(false);
                    });
                }
            });

        }
        else {
            set_backdrop(true);
            axios.delete(API_URL + `operation/delete/${operation._id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            }).then((response) => {
                if (response.data) {
                    set_backdrop(false);
                } else {
                    set_backdrop(false);
                }
            }).catch((err) => {
                console.log(err);
                set_backdrop(false);
            });
        }

    };

    const resolveOperation = (operation) => {
        set_backdrop(true);
        axios.patch(API_URL + `operation/resolve/${operation._id}`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        }).then((response) => {
            if (response.data) {
                set_backdrop(false);
            } else {
                set_backdrop(false);
            }
        }).catch((err) => {
            console.log(err);
            set_backdrop(false);
        });
    };

    const exportToCSV = () => {
        if (operations.length === 0) {
            alert("No operations to export.");
            return;
        }

        const headers = [
            "Request Number",
            "Truck Location",
            "Booth Location",
            "Request",
            "Notes",
            "Assigned Driver",
            "Request TimeStamp",
            "Request Time Elapsed",
            "Priority",
            "Resolved"
        ];

        const rows = operations.map(operation => [
            operation.requestNumber,
            operation.truckLocation,
            operation.boothLocation,
            operation.request,
            operation.notes,
            operation.assignedDriver,
            operation.requestTimeStamp,
            operation.requestTimeElapsed,
            operation.priority,
            operation.resolved ? "Yes" : "No"
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "operations.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="tabMainContainer">
            <div className="form-container">
                <input
                    type="text"
                    name="truckLocation"
                    value={formData.truckLocation}
                    onChange={handleChange}
                    placeholder="Truck Location"
                    className="input"
                />
                <input
                    type="text"
                    name="boothLocation"
                    value={formData.boothLocation}
                    onChange={handleChange}
                    placeholder="Booth Location"
                    className="input"
                />
                <input
                    type="text"
                    name="request"
                    value={formData.request}
                    onChange={handleChange}
                    placeholder="Request"
                    className="input"
                />
                <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Notes"
                    className="input"
                />

                {/* old code */}
                {/* <select
                    name="assignedDriver"
                    value={formData.assignedDriver}
                    onChange={handleChange}
                    className="input"
                >
                    {!formData.assignedDriver && <option value="" disabled hidden>Assigned Driver</option>}
                    {drivers.map((driver, index) => (
                        <option key={index} value={driver.assignedDriver}>{driver.DriverName}</option>
                    ))}
                </select> */}
                <select
                    name="assignedDriver"
                    value={formData.assignedDriver}
                    onChange={handleChange}
                    className="inputDropper"
                >
                    {!formData.assignedDriver && <option value="" disabled hidden>Assigned Driver</option>}
                    {drivers && drivers.length > 0 && drivers.map((driver, index) => (
                        <option key={index} value={driver._id}>{driver.name}</option>
                    ))}
                </select>

                <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="input"
                >
                    {!formData.priority && <option value="" disabled hidden>Priority</option>}
                    <option value="low">Low</option>
                    <option value="high">High</option>
                </select>
            </div>

            <div className='btn-truck-operations-main'>
                <button className='btn-truck-operations' onClick={addOperation}>
                    Add Operation
                </button>
                <button className='btn-truck-operations' onClick={exportToCSV}>
                    Export to CSV
                </button>
            </div>

            <div className="table-container">
                <table id='tableTab1TruckOperations'>
                    <thead>
                        <tr>
                            <th>Request Number</th>
                            <th>Truck Location</th>
                            <th>Booth Location</th>
                            <th>Request</th>
                            <th>Notes</th>
                            <th>Assigned Driver</th>
                            <th>Request TimeStamp</th>
                            <th>Request Time Elapsed (s)</th>
                            <th>Driver Assigned Time Elapsed (s)</th>
                            <th>ReAssigned Time Elapsed (s)</th>
                            <th>Priority</th>
                            <th>Delete</th>
                            <th>Resolve</th>
                        </tr>
                    </thead>
                    <tbody>
                        {operations && operations.length > 0 ? operations.map((operation) => (
                            <tr key={operation._id} className={`${operation.assignedDriver === 'NA' ? 'na-selected' : ''}`}>
                                <td>{operation.requestNumber}</td>
                                <td>{operation.truckLocation}</td>
                                <td>{operation.boothLocation}</td>
                                <td>{operation.request}</td>
                                <td>{operation.notes}</td>

                                <td>
                                    <select
                                        name={`assignedDriver-${operation._id}`}
                                        value={!operation.assignedDriver ? "" : operation.assignedDriver._id}
                                        onChange={(e) => reAssignDriver(e, operation._id)}
                                        className="input"
                                    >
                                        {/* {!operation.assignedDriver && <option value="" disabled hidden>Assigned Driver</option>} */}
                                        {/* <option value="">N/A</option> */}
                                        {operation.assignedDriver ? [...drivers, { _id: '', name: 'N/A' }, { _id: operation.assignedDriver._id, name: operation.assignedDriver.name }].map((driver, driverIndex) => (
                                            <option key={driverIndex} value={driver._id}>{driver.name}</option>
                                        )) : (
                                            [...drivers, { _id: '', name: 'N/A' }].map((driver, driverIndex) => (
                                                <option key={driverIndex} value={driver._id}>{driver.name}</option>
                                            ))
                                        )}
                                    </select>
                                </td>

                                <td>{new Date(operation.createdAt).toUTCString()}</td>
                                <TimerCell createdAt={operation.createdAt} />

                                <DriverAssignedTimer
                                    driverAssignedAt={operation?.driverHistory.filter((d) => d.isActive === true)[0]?.assignedAt}
                                    totalTimeCount={operation?.driverHistory.filter((d) => d.isActive === true)[0]?.totalTimeCount}
                                />

                                <NoDriverTimer
                                    unassignedStartAt={operation?.unassignedStartAt}
                                    noDriverTimeCount={operation?.noDriverTimeCount}
                                />

                                <td>
                                    <select
                                        name={`priority-${operation._id}`}
                                        value={operation.priority}
                                        onChange={(e) => handlePriorityChange(e, operation._id)}
                                        className="input"
                                    >
                                        <option value="low">Low</option>
                                        <option value="high">High</option>
                                    </select>
                                </td>

                                <td>
                                    <MdDeleteForever className='deleteIconTable' onClick={() => deleteOperation(operation)} />
                                    {operation?.status === 'deleted' &&
                                        <MdRestore className='reinstateIconTable' onClick={() => reinstateOperation(operation)} />
                                    }
                                </td>

                                <td><SiDavinciresolve className='resolveIconTable' onClick={() => resolveOperation(operation)} /></td>
                            </tr>
                        )) : (
                            <div className='noOperationMain'>
                                <p className='noOperationText'>No operations</p>
                            </div>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Tab1TruckOperations;