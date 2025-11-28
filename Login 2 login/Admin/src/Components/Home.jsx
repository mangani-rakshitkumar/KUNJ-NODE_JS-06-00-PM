import React from 'react'

const Home = () => {
  let userName = JSON.parse(localStorage.getItem("token"))
  return (
   <>
    <h1>Welcome, {userName.name}</h1>
   </>
  )
}

export default Home
