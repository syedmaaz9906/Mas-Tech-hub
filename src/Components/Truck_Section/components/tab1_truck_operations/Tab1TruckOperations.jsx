import React, { useState, useEffect } from 'react';
import './tab1TruckOperations.css';
import { MdDeleteForever } from "react-icons/md";
import { SiDavinciresolve } from "react-icons/si";
import axios from 'axios';
import Swal from 'sweetalert2';

let API_URL = 'https://backend.srv533347.hstgr.cloud/'
const Tab1TruckOperations = ({ user_details, set_backdrop }) => {
    const [formData, setFormData] = useState({
        truckLocation: '',
        boothLocation: '',
        request: '',
        notes: '',
        assignedDriver: '',
        priority: '',
    });
    const [drivers, setDrivers] = useState([]);
    const [operations, setOperations] = useState([]);


    const elapsedTimeCalculator = (select_time) => {
        const currentTime = new Date();
        const selectTimeDate = new Date(select_time);
        const diffInMillis = Math.abs(currentTime - selectTimeDate);

        return timeFormatter(diffInMillis)
    };

    const elapsedTimeFind = (select_time) => {
        const currentTime = new Date();
        const selectTimeDate = new Date(select_time);
        const diffInMillis = Math.abs(currentTime - selectTimeDate);
        return diffInMillis
    }

    function timeFormatter(diffInMillis) {
        const hours = Math.floor(diffInMillis / 3600000);
        const minutes = Math.floor((diffInMillis % 3600000) / 60000);
        const seconds = Math.floor((diffInMillis % 60000) / 1000);
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        return [formattedHours, formattedMinutes, formattedSeconds]
    }

    function counterTimer() {

        setOperations(prevOperations => prevOperations.map(operation => ({
            ...operation,
            RequestTimeElapsedCounter: operation.RequestTimeElapsedCounter + 1000,
            DriverTimeElapsedCounter: operation.DriverTimeElapsedCounter + 1000,
            RequestTimeElapsed: timeFormatter(operation.RequestTimeElapsedCounter + 1000),
            DriverTimeElapsed: timeFormatter(operation.DriverTimeElapsedCounter + 1000),
        })));
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    useEffect(() => {
        set_backdrop(true);
        axios.get(API_URL + 'get_truck_operation', {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            // console.log(response.data);
            set_backdrop(false);
            const resp = response.data;
            setOperations(resp?.truck_operations?.map(dat => {
                return {
                    ...dat,
                    RequestTimeElapsed: elapsedTimeCalculator(dat.TimeStarted),
                    DriverTimeElapsed: elapsedTimeCalculator(dat.DriverTimeStarted),
                    RequestTimeElapsedCounter: elapsedTimeFind(dat.TimeStarted),
                    DriverTimeElapsedCounter: elapsedTimeFind(dat.DriverTimeStarted),

                };
            }));
            setDrivers(resp.drivers);
            setInterval(counterTimer, 1000);
        })
            .catch(err => { set_backdrop(false); console.warn(err) });
    }, []);


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
        axios.post(API_URL + 'add_truck_operation',
            operationData
        ).then((response) => {
            if (response.status === 200) {
                const dat = response.data;
                setOperations((operation) => [...operation, ...dat.operation?.map(dat => {
                    return {
                        ...dat,
                        RequestTimeElapsed: elapsedTimeCalculator(dat.TimeStarted),
                        DriverTimeElapsed: elapsedTimeCalculator(dat.DriverTimeStarted),
                        RequestTimeElapsedCounter: elapsedTimeFind(dat.TimeStarted),
                        DriverTimeElapsedCounter: elapsedTimeFind(dat.DriverTimeStarted),

                    };
                })]);
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
        }).catch((error) => {
            console.log("Error", error);
            set_backdrop(false);
        })

        // console.log('FORMMMMMMMMMMMDAATAAAAAAAAAAAAAAA', formData)

        // const updatedOperations = [...operations, newOperation];
        // setOperations(updatedOperations);
        // localStorage.setItem('operations', JSON.stringify(updatedOperations));

        // setRequestNumber(requestNumber + 1);
        // localStorage.setItem('requestNumber', requestNumber + 1);

        // setFormData({
        //     truckLocation: '',
        //     boothLocation: '',
        //     request: '',
        //     notes: '',
        //     assignedDriver: '',
        //     priority: '',
        // });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setOperations((prevOperations) =>
                prevOperations.map((operation) => ({
                    ...operation,
                    requestTimeElapsed: operation.requestTimeElapsed + 1,
                }))
            );
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleDriverChange = (e, operationID) => {
        const newDriverID = e.target.value;
        setOperations(operations.map(operation =>
            operation.ID === operationID ? { ...operation, DriverID: newDriverID, DriverName: drivers.find(driver => driver.DriverID === newDriverID).DriverName } : operation
        ));
    };

    const handlePriorityChange = (e, operationID) => {
        const newPriority = e.target.value;
        setOperations(operations.map(operation =>
            operation.ID === operationID ? { ...operation, Priority: newPriority } : operation
        ));
    };

    const deleteOperation = (operation) => {
        const id = operation.ID;
        const status = operation.OperationStatus;
        const driver_id = operation.DriverID
        if (status === 'deleted') {
            if (user_details.Role === "volunteer") {
                return alert("Only admins can delete permenantly");
            }
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
                    axios.delete(API_URL + 'delete_truck_operation', {
                        params: {
                            id: id,
                            status: status,
                            driver_id: driver_id,
                        }
                    }).then((response) => {
                        if (response.data) {
                            setOperations(operations.filter(row => row.ID !== id));
                            set_backdrop(false);
                            Swal.fire({
                                title: "Deleted!",
                                text: "Operation has been deleted.",
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

        }
        else {
            set_backdrop(true);
            axios.delete(API_URL + 'delete_truck_operation', {
                params: {
                    id: id,
                    status: status,
                    driver_id: driver_id,
                }
            }).then((response) => {
                if (response.data) {
                    setOperations(operations.map(row => {
                        if (row.ID === id) {
                            return {
                                ...row,
                                OperationStatus: "deleted"
                            };
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

    const resolveOperation = (operation) => {
        const status = operation.OperationStatus === 'active' ? 'resolved' : 'active'
        const id = operation.ID;
        const driver_id = operation.DriverID
        set_backdrop(true);
        axios.put(API_URL + 'update_truck_operation',
            { status: status, id: id, assignedDriver: driver_id }).then((response) => {
                if (response.data) {
                    if (status === 'resolved') {
                        console.log(operations)
                        setOperations(operations.filter(row => row.ID !== id));
                    }
                    else {
                        setOperations(operations.map(row => {
                            if (row.ID === id) {
                                return {
                                    ...row,
                                    OperationStatus: 'active'
                                };
                            }
                            return row;
                        }));
                    }
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
                        <option key={index} value={driver.DriverID}>{driver.DriverName}</option>
                    ))}
                </select> */}
                <select
                    name="assignedDriver"
                    value={formData.assignedDriver}
                    onChange={handleChange}
                    className="input"
                >
                    {!formData.assignedDriver && <option value="" disabled hidden>Assigned Driver</option>}
                    <option value="NA">NA</option>
                    {drivers.map((driver, index) => (
                        <option key={index} value={driver.DriverID}>{driver.DriverName}</option>
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
                            {/* <th>ReAssigned Time Elapsed (s)</th> */}
                            <th>Priority</th>
                            <th>Delete</th>
                            <th>Resolve</th>
                        </tr>
                    </thead>
                    <tbody>
                        {operations.map((operation) => (
                            <tr key={operation.ID} className={`${operation.OperationStatus === 'deleted' ? 'deleted' : ''} ${operation.DriverID === 'NA' ? 'na-selected' : ''}`}>
                                <td>{operation.RequestNumber}</td>
                                <td>{operation.TruckLocation}</td>
                                <td>{operation.BoothLocation}</td>
                                <td>{operation.Request}</td>
                                <td>{operation.Notes}</td>
                                {/* old code */}
                                {/* <td>
                                    <select
                                        name={`assignedDriver-${operation.ID}`}
                                        value={operation.DriverID}
                                        onChange={(e) => handleDriverChange(e, operation.ID)}
                                        className="input"
                                    >
                                        {!operation.DriverID && <option value="" disabled hidden>Assigned Driver</option>}
                                        {drivers.map((driver, driverIndex) => (
                                            <option key={driverIndex} value={driver.DriverID}>{driver.DriverName}</option>
                                        ))}
                                    </select>
                                </td> */}
                                <td>
                                    <select
                                        name={`assignedDriver-${operation.ID}`}
                                        value={operation.DriverID}
                                        onChange={(e) => handleDriverChange(e, operation.ID)}
                                        className="input"
                                    >
                                        {!operation.DriverID && <option value="" disabled hidden>Assigned Driver</option>}
                                        <option value="NA">NA</option>
                                        {drivers.map((driver, driverIndex) => (
                                            <option key={driverIndex} value={driver.DriverID}>{driver.DriverName}</option>
                                        ))}
                                    </select>
                                </td>

                                <td>{operation.TimeStarted}</td>
                                <td>{`${operation.RequestTimeElapsed[0]}:${operation.RequestTimeElapsed[1]}:${operation.RequestTimeElapsed[2]}`}</td>
                                <td>{`${operation.DriverTimeElapsed[0]}:${operation.DriverTimeElapsed[1]}:${operation.DriverTimeElapsed[2]}`}</td>
                                {/* <td>0:00</td> */}
                                <td>
                                    <select
                                        name={`priority-${operation.ID}`}
                                        value={operation.Priority}
                                        onChange={(e) => handlePriorityChange(e, operation.ID)}
                                        className="input"
                                    >
                                        <option value="low">Low</option>
                                        <option value="high">High</option>
                                    </select>
                                </td>
                                {/* <td>{operation.Priority}</td> */}
                                <td><MdDeleteForever className='deleteIconTable' onClick={() => deleteOperation(operation)} /></td>
                                <td><SiDavinciresolve className='resolveIconTable' onClick={() => resolveOperation(operation)} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Tab1TruckOperations;