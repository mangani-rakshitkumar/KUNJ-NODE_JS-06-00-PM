const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const AuthModel = require("./Models/AuthModel")

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/userdb")

app.post("/login", async (req, res) => {
    const { email, password } = req.body

    let existingUser = await AuthModel.findOne({ email })

    if (!existingUser) {
        res.json({ message: "user not exist !" })
    }
    else {

        let hashedPass = await bcrypt.compare(password , existingUser.password)

        console.log(hashedPass)




        if (hashedPass) {
            let token = await jwt.sign({id : existingUser._id} , "6@pm" , {expiresIn : "1h"})
            console.log(token)
            let name = existingUser.name
            res.json({ message: "user loggedIn !"  , token , name})
        }
        else {
            res.json({ message: "Invalid !" })
        }
    }




})
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body



    let existingUser = await AuthModel.findOne({ email })

    if(existingUser){
        res.json({ message: "user already exist !" })
    }
    else{

        let hashedPass = await bcrypt.hash(password , 10)

        let user = await AuthModel.create({ name, email, password : hashedPass })
        user.save()

        res.json({ message: "user created !" })
    }

    

})

app.listen(8080, () => {
    console.log("server is running....")
})