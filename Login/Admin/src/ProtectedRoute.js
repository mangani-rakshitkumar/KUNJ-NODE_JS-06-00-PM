import React from 'react'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token")

  if (!token) {
    alert("Token is not there !")
    return null
  }

  return children
}

export default ProtectedRoute
