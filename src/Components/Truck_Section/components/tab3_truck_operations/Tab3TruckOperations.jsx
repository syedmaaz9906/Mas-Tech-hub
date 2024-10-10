import React, { useEffect } from 'react'
import './tab3TruckOperations.css';
import { MdDeleteForever, MdRestore } from "react-icons/md";
import axios from 'axios';
import { io } from 'socket.io-client';
import Swal from 'sweetalert2';

const socket = io(process.env.SOCKET_URL);
let API_URL = process.env.API_URL;

const Tab3TruckOperations = ({ set_backdrop, resolvedOperations, fetchResolvedOperations }) => {

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchResolvedOperations();

        // Listen for operationDeleted event
        socket.on('operationDeleted', (deletedOperation) => {
            console.log('Deleted Operation:', deletedOperation);
            fetchResolvedOperations();
        });

        // Listen for operationReinstated event
        socket.on('operationReinstated', (updatedOperation) => {
            console.log('Reinstated Operation:', updatedOperation);
            fetchResolvedOperations();
        });

        // Cleanup on unmount
        return () => {
            socket.off('operationDeleted');
            socket.off('operationReinstated');
        };
    }, []);

    const getTimeElapsed = (createdAt) => {
        const createdTime = new Date(createdAt);
        const currentTime = new Date();
        const timeDiff = Math.abs(currentTime - createdTime);

        // Calculate days, hours, minutes, seconds
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        // Format and return the elapsed time
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
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
    const exportToCSV = () => {
        if (resolvedOperations.length === 0) {
            alert("No resolvedOperations to export.");
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

        const rows = resolvedOperations.map(operation => [
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
        a.download = "resolvedOperations.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="tabMainContainer">
            <div className='btn-truck-operations-main'>
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
                            <th>Priority</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resolvedOperations && resolvedOperations.length > 0 ? resolvedOperations.map((operation) => (
                            <tr key={operation?._id} className={operation.OperationStatus == 'resolved' ? 'resolvedTruck3' : 'resolvedTruck3'}>
                                <td>{operation?.requestNumber}</td>
                                <td>{operation?.truckLocation}</td>
                                <td>{operation?.boothLocation}</td>
                                <td>{operation?.request}</td>
                                <td>{operation?.notes}</td>
                                <td>{operation?.assignedDriver ? operation?.driverHistory.filter((d) => operation?.assignedDriver._id === d.driverId)[0].driverName : "N/A"}</td>
                                <td>{operation?.createdAt}</td>
                                <td>{getTimeElapsed(operation.createdAt)}</td>
                                <td>{operation.priority}</td>
                                <td>
                                    <MdDeleteForever className='deleteIconTable' onClick={() => deleteOperation(operation)} />
                                    {operation?.status === 'deleted' &&
                                        <MdRestore className='reinstateIconTable' onClick={() => reinstateOperation(operation)} />
                                    }
                                </td>
                            </tr>
                        )) : (
                            <div className='noOperationMain'>
                                <p className='noOperationText'>No resolved operations</p>
                            </div>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Tab3TruckOperations