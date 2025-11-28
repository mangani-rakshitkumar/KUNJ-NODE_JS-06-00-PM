import React, { useState } from 'react'
import axios from 'axios'
import { Link, Navigate, useNavigate } from 'react-router-dom'

const LogIn = () => {
    let [email , setEmail] = useState("")
    let [password , setPassword] = useState("")
    let navigate = useNavigate()
    let handleLogIn = (()=>{
        
       
        axios.post("http://localhost:8080/login",{email,password})
            .then((res)=>{
                alert(res.data.message)
                if(res.data.token){
                    let tokenObj = {
                        name : res.data.name,
                        token : res.data.token, 
                    }
                    localStorage.setItem("token", JSON.stringify(tokenObj))
                    navigate("/home")
                }
            })
            .catch((err)=>{
                console.log(err)
            })
    })
  return (
    <div className="auth-card">
        <div className="card">
            <input type="text" placeholder='email' onChange={(e)=>setEmail(e.target.value)} value={email}/>
            <input type="text" placeholder='password' onChange={(e)=>setPassword(e.target.value)} value={password}/>
            <button onClick={handleLogIn}>Log In</button>
            <br />
            <Link to="/signup">If you don't have an account ?</Link>
        </div>
    </div>
  )
}

export default LogIn
