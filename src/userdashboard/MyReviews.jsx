import React from 'react'
import UserSidebar from '../comp/Usersidebar'
import "../pagesstyles/dashboard.css"

const MyReviews = () => {
  return (
    <div>       
      <div className="layout">
        <UserSidebar />
        <main className="main-content">
          My Reviews
        </main>
      </div>
    </div>
  )
}

export default MyReviews
