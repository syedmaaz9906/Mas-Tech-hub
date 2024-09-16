import React from 'react'
import './tab2VendorOperations.css'
import { SiDavinciresolve } from 'react-icons/si'

const Tab2VendorOperations = () => {
    return (
        <div className='tabMainContainer'>
            <div className='btn-vendor-operations-main'>
                <button className='btn-vendor-operations'>
                    Export to CSV
                </button>
                <button className='btn-vendor-operations'>
                    Clear Data
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
                            <th>On Time</th>
                            <th>Resolve</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>hi</td>
                            <td>hi</td>
                            <td>hi</td>
                            <td>hi</td>
                            <td>hi</td>
                            <td>hi</td>
                            <td>hi</td>
                            <td><SiDavinciresolve className='resolveIconTable' /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Tab2VendorOperations