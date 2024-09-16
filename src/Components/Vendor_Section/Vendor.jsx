import React from 'react'
import './vendor.css'
import TabsVendorOperations from './components/tabs_vendor_operations/TabsVendorOperations'

const Vendor = () => {
    return (
        <div>
            <div className='vendorMain'>
                <div className="vendorTitle">
                    <h2>Vendor Page</h2>
                </div>
            </div>

            <div className='vendorBodyMain'>
                <TabsVendorOperations />
            </div>
        </div>
    )
}

export default Vendor