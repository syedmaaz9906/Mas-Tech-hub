import React, { useState } from 'react';
import './adminOperationsBody.css';
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import axios from 'axios';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2';

let API_URL = 'https://backend.srv533347.hstgr.cloud/';
const AdminOperationsBody = ({ user_data, set_user_data }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage] = useState(10);
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState('all');
    const [confirmInput, setConfirmInput] = useState('');
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        setCurrentPage(1);
    };

    const handleDelete = (id, stat) => {
        if (stat !== 'pending') {
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
                    setOpen(true);
                    axios.delete(API_URL + 'delete_user', {
                        params: {
                            id: id
                        }
                    }).then((response) => {
                        if (response.data) {
                            set_user_data(user_data.map(row => row.ID === id ? { ...row, permanentlyDeleted: true } : row));
                            setOpen(false);
                            Swal.fire({
                                title: "Deleted!",
                                text: "User has been deleted.",
                                icon: "success"
                            });
                        } else {
                            console.log(response.data);
                            setOpen(false);
                        }
                    }).catch((err) => {
                        console.log(err);
                        setOpen(false);
                    });
                }
            });
        } else {
            setOpen(true);
            let status = "rejected";
            axios.put(API_URL + 'update_user_status',
                { status: status, id: id }).then((response) => {
                    if (response.data) {
                        set_user_data(user_data.map(row => {
                            if (row.ID === id) {
                                row.AccountStatus = status;
                            }
                            return row;
                        }));
                        setOpen(false);
                    } else {
                        console.log(response.data);
                        setOpen(false);
                    }
                }).catch((err) => {
                    console.log(err);
                    setOpen(false);
                });
        }
    };

    const handleActiveInactive = (id, stat) => {
        setOpen(true);
        let status = "active";
        if (stat === "active") {
            status = "inactive";
        }
        axios.put(API_URL + 'update_user_status',
            { status: status, id: id }).then((response) => {
                if (response.data) {
                    set_user_data(user_data.map(row => {
                        if (row.ID === id) {
                            row.AccountStatus = status;
                        }
                        return row;
                    }));
                    setOpen(false);
                }
                else {
                    console.log(response.data);
                    setOpen(false);
                }
            }).catch((err) => {
                console.log(err);
                setOpen(false);
            });
    };

    const filteredData = user_data.filter(row =>
        (row.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.Email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filter === 'all' ? !row.permanentlyDeleted : (filter === 'inactive' && row.AccountStatus === 'inactive'))
    );

    function toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
        );
    }

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setConfirmInput('');
        setError('');
    };

    const handleConfirmChange = (event) => {
        setConfirmInput(event.target.value);
        setError('');
    };

    const handleClearAllData = () => {
        if (confirmInput === 'confirm') {
            handleCloseModal();
            // Logic for clearing data goes here
            if((user_data.filter(row => row.AccountStatus === 'deleted')).length === 0){
                alert("No Delete Account Present!")
                return
            }
            setOpen(true);
            axios.delete(API_URL + 'delete_users').then((response) => {
                if (response.data) {
                    set_user_data(user_data.filter(row => row.AccountStatus !== 'deleted'));
                    setOpen(false);
                    Swal.fire({
                        title: "Deleted!",
                        text: "Users have been deleted",
                        icon: "success"
                    });
                } else {
                    console.log(response.data);
                    setOpen(false);
                }
            }).catch((err) => {
                console.log(err);
                setOpen(false);
            });
            
            
        } else {
            setError('Please type "confirm" to clear all deleted data.');
        }
    };

    const exportToCSV = () => {
        // Select columns to export
        const columnsToExport = ['Name', 'Email', 'Role', 'Status'];

        // Generate CSV content
        const csvContent = "data:text/csv;charset=utf-8," +
            columnsToExport.join(",") + "\n" +
            currentEntries.map(row => columnsToExport.map(col => row[col]).join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "export.csv");
        document.body.appendChild(link);

        link.click();
    };

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className="admin-operations-body">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="search-input"
                    />
                    <select value={filter} onChange={handleFilterChange} className="filter-dropdown">
                        <option value="all">All</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <div className="table-container">
                    <table className="responsive-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Account Type</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentEntries.map((row, index) => (
                                <tr key={row.ID}>
                                    {row.permanentlyDeleted ? (
                                        <>
                                            <td>{row.Name}</td>
                                            <td>{row.Email}</td>
                                            <td>{row.Role}</td>
                                            <td style={{ color: row.AccountStatus === 'active' ? 'green' : 'red' }}>{toTitleCase(row.AccountStatus)}</td>
                                            <td style={{ textAlign: 'center' }}>Deleted User</td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{row.Name}</td>
                                            <td>{row.Email}</td>
                                            <td>{row.Role}</td>
                                            <td style={{ color: row.AccountStatus === 'active' ? 'green' : 'red' }}>{toTitleCase(row.AccountStatus)}</td>
                                            <td>
                                                <div className='table-action-buttons'>
                                                    <button className='table-action-button-accept' onClick={() => { handleActiveInactive(row.ID, row.AccountStatus) }}>
                                                        {row.AccountStatus === 'inactive' ? 'Activate' : row.AccountStatus === 'pending' ? 'Activate' : row.AccountStatus === 'rejected' ? 'Activate' : row.AccountStatus === 'deleted' ? 'Reinstate' : 'DeActivate'}</button>
                                                    <button className='table-action-button-cancel' onClick={() => { handleDelete(row.ID, row.AccountStatus) }}>
                                                        {row.AccountStatus === 'pending' ? 'Reject' : 'Delete'}</button>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                {filteredData.length > entriesPerPage && (
                    <div className="pagination">
                        <button className='pagination-button-prev' onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                            <FaAngleLeft />
                            <p>Prev</p>
                        </button>
                        <button className='pagination-button-next' onClick={() => paginate(currentPage + 1)} disabled={indexOfLastEntry >= filteredData.length}>
                            <p>Next</p>
                            <FaAngleRight />
                        </button>
                    </div>
                )}

                {/* <div className='clear-export-buttons'>
                    <button className='clear-all-data-button' onClick={handleOpenModal}>
                        Clear All Data
                    </button>

                    <button className='export-to-csv-button' onClick={exportToCSV}>
                        Export To CSV
                    </button>
                </div> */}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Clear All Data</h2>
                        <p>Would you like to clear all deleted data? Please type ‘confirm’ to remove all deleted data.</p>
                        <input
                            type="text"
                            value={confirmInput}
                            onChange={handleConfirmChange}
                            placeholder="Type 'confirm' here"
                            className="modal-input"
                        />
                        {error && <p className="modal-error">{error}</p>}
                        <div className="modal-buttons">
                            <button className="modal-button-cancel" onClick={handleCloseModal}>Cancel</button>
                            <button className="modal-button-confirm" onClick={handleClearAllData}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminOperationsBody;
