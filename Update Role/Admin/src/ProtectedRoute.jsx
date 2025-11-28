import React from 'react'
import Cookies from 'js-cookie'
import Login from './Components/Login'

const ProtectedRoute = ({ children }) => {
    const token = Cookies.get("token")
    return token ? children : <Login />
}

export default ProtectedRoute
