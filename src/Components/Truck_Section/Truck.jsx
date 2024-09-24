import React from 'react'
import './truck.css'
import TabsTruckOperations from './components/tabs_truck_operations/TabsTruckOperations'

const Truck = () => {
    return (
        <div>
            <div className='truckMain'>
                <div className="truckTitle">
                    <h2>Truck Page</h2>
                </div>
            </div>
            
            <div className='truckBodyMain'>
                <TabsTruckOperations />
            </div>
        </div>
    )
}

export default Truck