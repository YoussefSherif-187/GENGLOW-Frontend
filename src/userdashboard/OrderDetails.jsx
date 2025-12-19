import React from 'react'
import UserSidebar from '../comp/Usersidebar'
import "../pagesstyles/dashboard.css"

const OrderDetails = () => {
  return (
    <div>       
      <div className="layout">
        <UserSidebar />
        <main className="main-content">
          Order Details
        </main>
      </div>
    </div>
  )
}

export default OrderDetails
