import React, { useEffect, useState } from 'react'
import './tab3TruckOperations.css';

import { MdDeleteForever } from "react-icons/md";
import { SiDavinciresolve } from "react-icons/si";
import axios from 'axios';
import Swal from 'sweetalert2';

let API_URL = 'https://backend.srv533347.hstgr.cloud/'
const Tab3TruckOperations = ({ user_details, set_backdrop }) => {

    // const [formData, setFormData] = useState({
    //     truckLocation: '',
    //     boothLocation: '',
    //     request: '',
    //     notes: '',
    //     assignedDriver: '',
    //     priority: '',
    // });

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


    useEffect(() => {
        set_backdrop(true);
        axios.get(API_URL + 'get_resolved_truck_oeprations', {
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
            // setDrivers(resp.drivers);
            setInterval(counterTimer, 1000);
        })
            .catch(err => { set_backdrop(false); console.warn(err) });
    }, []);

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData({
    //         ...formData,
    //         [name]: value,
    //     });
    // };

    // const addOperation = () => {
    //     const newOperation = {
    //         requestNumber: requestNumber,
    //         truckLocation: formData.truckLocation,
    //         boothLocation: formData.boothLocation,
    //         request: formData.request,
    //         notes: formData.notes,
    //         assignedDriver: 'N/A',
    //         requestTimeStamp: new Date().toLocaleString(),
    //         requestTimeElapsed: 0,
    //         priority: formData.priority,
    //         resolved: false,
    //     };

    //     const updatedOperations = [...operations, newOperation];
    //     setOperations(updatedOperations);
    //     localStorage.setItem('operations', JSON.stringify(updatedOperations));

    //     setRequestNumber(requestNumber + 1);
    //     localStorage.setItem('requestNumber', requestNumber + 1);

    //     setFormData({
    //         truckLocation: '',
    //         boothLocation: '',
    //         request: '',
    //         notes: '',
    //         assignedDriver: '',
    //         priority: '',
    //     });
    // };


    const deleteOperation = (requestNumber) => {
        const updatedOperations = operations.filter((operation) => operation.requestNumber !== requestNumber);
        setOperations(updatedOperations);
        localStorage.setItem('operations', JSON.stringify(updatedOperations));
    };

    const resolveOperation = (requestNumber) => {
        const updatedOperations = operations.map((operation) =>
            operation.requestNumber === requestNumber
                ? { ...operation, resolved: !operation.resolved }
                : operation
        );
        setOperations(updatedOperations);
        localStorage.setItem('operations', JSON.stringify(updatedOperations));
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
            {/* <div className="form-container">
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
                <select
                    name="assignedDriver"
                    value={formData.assignedDriver}
                    onChange={handleChange}
                    className="input"
                    disabled
                >
                    <option value="" disabled>Assigned Driver</option>
                    <option value="option1" disabled>N/A</option>
                </select>
                <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="input"
                >
                    <option value="" disabled>Priority</option>
                    <option value="Low">Low</option>
                    <option value="High">High</option>
                </select>
            </div> */}

            <div className='btn-truck-operations-main'>
                {/* <button className='btn-truck-operations' onClick={addOperation}>
                    Add Operation
                </button> */}
                <button className='btn-truck-operations' onClick={exportToCSV}>
                    Export to CSV
                </button>
            </div>

            <div className="table-container">
                <table id='tableTab3TruckOperations'>
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
                            {/* <th>Driver Assigned Time Elapsed (s)</th> */}
                            {/* <th>ReAssigned Time Elapsed (s)</th> */}
                            <th>Priority</th>
                            <th>Delete</th>
                            {/* <th>Resolve</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {operations.map((operation) => (
                            // <tr key={operation.ID} className={operation.resolved ? 'resolved' : 'resolved'}>
                            <tr key={operation.ID} className={operation.OperationStatus == 'resolved' ? 'resolvedTruck3' : 'resolvedTruck3'}>
                                <td>{operation.RequestNumber}</td>
                                <td>{operation.TruckLocation}</td>
                                <td>{operation.BoothLocation}</td>
                                <td>{operation.Request}</td>
                                <td>{operation.Notes}</td>
                                <td>{operation.DriverName}</td>
                                <td>{operation.TimeStarted}</td>
                                <td>{`${operation.RequestTimeElapsed[0]}:${operation.RequestTimeElapsed[1]}:${operation.RequestTimeElapsed[2]}`}</td>
                                {/* <td>{`${operation.DriverTimeElapsed[0]}:${operation.DriverTimeElapsed[1]}:${operation.DriverTimeElapsed[2]}`}</td> */}
                                {/* <td>0:00</td> */}
                                <td>{operation.Priority}</td>
                                <td><MdDeleteForever className='deleteIconTable' onClick={() => deleteOperation(operation)} /></td>
                                {/* <td><SiDavinciresolve className='resolveIconTable' onClick={() => resolveOperation(operation)} /></td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Tab3TruckOperations