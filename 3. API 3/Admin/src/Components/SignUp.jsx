import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const SignUp = () => {
    let [name, setName] = useState("")
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")

    let handleSignUp = (() => {
        axios.post("http://localhost:8080/signup", { name, email, password })
            .then((res) => {
                alert(res.data.message)
                localStorage.setItem("users",JSON.stringify(res.data.users))
            })
            .catch((err) => {
                console.log(err)
            })

        setName("")
        setEmail("")
        setPassword("")
    })
    return (
        <div>
            <input type="text" placeholder='name' onChange={(e) => setName(e.target.value)} value={name} /> 
            <input type="text" placeholder='email' onChange={(e) => setEmail(e.target.value)} value={email} />
            <input type="text" placeholder='password' onChange={(e) => setPassword(e.target.value)} value={password} />
            <br />
            <button onClick={handleSignUp}>SignUp</button>
            <br />
            <Link to="/">If already have an account ?</Link>

        </div>
    )
}

export default SignUp
