import React from 'react'

const ProtectedRoute = ({children}) => {

    let token = localStorage.getItem("token")
    if(!token){
        alert("Token is not there !")
    }

  return children
}

export default ProtectedRoute
