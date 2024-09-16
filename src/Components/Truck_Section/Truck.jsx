import React from 'react'
import './truck.css'
import TabsTruckOperations from './components/tabs_truck_operations/TabsTruckOperations'

const Truck = ({user_details}) => {
    return (
        <div>
            <div className='truckMain'>
                <div className="truckTitle">
                    <h2>Truck Page</h2>
                </div>
            </div>
            
            <div className='truckBodyMain'>
                <TabsTruckOperations user_details={user_details} />
            </div>
        </div>
    )
}

export default Truck