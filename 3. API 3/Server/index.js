const express = require("express")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cors())

let users = []

function auth(req, res, next) {

    let token = 5114
    if (token) {
        next()
    }
    else{
        res.json({message : "invalid !"})
    }

}

app.get("/user", auth, (req, res) => {

    res.json({ message: "USER DASH..." })
})

app.post("/login", (req, res) => {
    const { email, password, signupData } = req.body
    // console.log(email,password,signupData)

    signupData.map((e) => {
        if (email === e.email && password === e.password) {
            let name = e.name
            res.json({ message: "user logged in !", name })
        }
        else {
            res.json({ message: "invalid !" })
        }
    })

})
app.post("/signup", (req, res) => {
    const { name, email, password } = req.body

    const user = {
        name: name,
        email: email,
        password: password
    }

    users.push(user)
    res.json({ message: "user created !", users })


})

app.listen(8080, () => {
    console.log("server is running....")
})

