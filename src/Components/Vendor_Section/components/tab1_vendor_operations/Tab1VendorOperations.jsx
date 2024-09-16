import React, { useState, useEffect } from 'react';
import './tab1VendorOperations.css';
import { MdDeleteForever } from "react-icons/md";
import { SiDavinciresolve } from "react-icons/si";

const Tab1VendorOperations = () => {
    const [name, setName] = useState('');
    const [boothLocation, setBoothLocation] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [trolleyNumber, setTrolleyNumber] = useState('');
    const [notes, setNotes] = useState('');
    const [defaultTimer, setDefaultTimer] = useState(5);
    const [entries, setEntries] = useState(() => {
        const savedEntries = localStorage.getItem('vendorEntries');
        return savedEntries ? JSON.parse(savedEntries) : [];
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'name':
                setName(value);
                break;
            case 'boothLocation':
                setBoothLocation(value);
                break;
            case 'phoneNumber':
                setPhoneNumber(value);
                break;
            case 'trolleyNumber':
                setTrolleyNumber(value);
                break;
            case 'notes':
                setNotes(value);
                break;
            case 'defaultTimer':
                setDefaultTimer(parseInt(value));
                break;
            default:
                break;
        }
    };

    const handleAddEntry = () => {
        const newEntry = {
            name,
            boothLocation,
            phoneNumber,
            trolleyNumber,
            notes,
            timer: defaultTimer * 60,
            resolved: false, // Initialize resolved state
        };
        setEntries([...entries, newEntry]);
        localStorage.setItem('vendorEntries', JSON.stringify([...entries, newEntry]));

        // Reset input fields
        setName('');
        setBoothLocation('');
        setPhoneNumber('');
        setTrolleyNumber('');
        setNotes('');
        setDefaultTimer(5);
    };

    const handleDelete = (index) => {
        const updatedEntries = [...entries];
        updatedEntries.splice(index, 1);
        setEntries(updatedEntries);
        localStorage.setItem('vendorEntries', JSON.stringify(updatedEntries));
    };

    const handleResolve = (index) => {
        const updatedEntries = [...entries];
        updatedEntries[index].resolved = !updatedEntries[index].resolved;
        setEntries(updatedEntries);
        localStorage.setItem('vendorEntries', JSON.stringify(updatedEntries));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setEntries(prevEntries => {
                return prevEntries.map(entry => {
                    if (entry.timer > 0) {
                        return {
                            ...entry,
                            timer: entry.timer - 1
                        };
                    } else {
                        return null;
                    }
                }).filter(entry => entry !== null);
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        localStorage.setItem('vendorEntries', JSON.stringify(entries));
    }, [entries]);

    return (
        <div className="tab1VendorOperationsContainer">
            <div className="form-container">
                <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="input"
                />
                <input
                    type="text"
                    name="boothLocation"
                    value={boothLocation}
                    onChange={handleChange}
                    placeholder="Booth Location"
                    className="input"
                />
                <input
                    type="tel"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="input"
                />
                <input
                    type="text"
                    name="trolleyNumber"
                    value={trolleyNumber}
                    onChange={handleChange}
                    placeholder="Trolley Number"
                    className="input"
                />
                <input
                    type="text"
                    name="notes"
                    value={notes}
                    onChange={handleChange}
                    placeholder="Notes"
                    className="input"
                />
                <input
                    type="number"
                    name="defaultTimer"
                    value={defaultTimer}
                    onChange={handleChange}
                    placeholder="Default Timer (minutes)"
                    className="input"
                />
            </div>

            <div className='btn-truck-operations-main'>
                <button className='btn-truck-operations' onClick={handleAddEntry}>
                    Add Entry
                </button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Booth Location</th>
                            <th>Phone Number</th>
                            <th>Trolley Number</th>
                            <th>Notes</th>
                            <th>Timer</th>
                            <th>Resolve</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((entry, index) => (
                            <tr key={index} className={entry.resolved ? 'resolved' : ''}>
                                <td>{entry.name}</td>
                                <td>{entry.boothLocation}</td>
                                <td>{entry.phoneNumber}</td>
                                <td>{entry.trolleyNumber}</td>
                                <td>{entry.notes}</td>
                                <td>{Math.ceil(entry.timer / 60)} mins</td>
                                <td>
                                    <SiDavinciresolve className='resolveIconTable' onClick={() => handleResolve(index)} />
                                </td>
                                <td>
                                    <MdDeleteForever className='deleteIconTable' onClick={() => handleDelete(index)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Tab1VendorOperations;
