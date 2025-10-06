import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'

const User = () => {
  let name = localStorage.getItem("username")
  useEffect(() => {
    axios.get("http://localhost:8080/user")
      .then((res) => {
        alert(res.data.message)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <div>
      <h1>welcome, {name}</h1>
    </div>
  )
}

export default User
