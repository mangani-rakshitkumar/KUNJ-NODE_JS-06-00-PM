const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const authModel = require("./Models/AuthModel")
const bcrypt = require("bcrypt");

const app = express()
app.use(express.json())
app.use(cors())


mongoose.connect("mongodb://localhost:27017/user")


app.post("/login",async (req, res) => {
    const { email, password} = req.body
    // console.log(email,password,signupData)

   let existingUser = await authModel.findOne({email})
   if(email = existingUser.email && password = existingUser.password){
       res.json({message:"user logged in !"})
   }
   else{
        res.json({message:"invalid !"})
   }

})



app.post("/signup", (req, res) => {
    const { name, email, password } = req.body

 let existingEmail = await authModel.findOne({email})
 console.log(existingEmail)

  if (!existingEmail) {
    let user = await authModel.create({name , email , password})
    user.save()

    res.json({ message: "user created" })
  }

  else{
    res.json({ message: "user already exists" })
  }


})

app.listen(8080, () => {
    console.log("server is running....")
})

