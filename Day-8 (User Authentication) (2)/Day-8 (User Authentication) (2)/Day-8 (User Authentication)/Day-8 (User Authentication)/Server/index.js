const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const cors = require("cors")

const authModel = require("./Models/Auth")
const roleModel = require("./Models/Role")
const productModel = require("./Models/Product")

const app = express()

// Middleware
app.use(express.json())
app.use(cors())

// Authentication middleware for Super Admin
const authenticateSuperAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." })
        }
        
        const decoded = jwt.verify(token, "demo@rnw")
        if (decoded.role !== 'superadmin') {
            return res.status(403).json({ message: "Access denied. Super Admin only." })
        }
        
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({ message: "Invalid token." })
    }
}

// Initialize predefined roles
const initializeRoles = async () => {
    try {
        const existingRoles = await roleModel.countDocuments()
        if (existingRoles === 0) {
            const predefinedRoles = [
                { name: "User", permissions: ["read"], description: "Basic user with read access" },
                { name: "Admin", permissions: ["read", "write", "update"], description: "Admin with management access" },
                { name: "Manager", permissions: ["read", "write", "manage_users"], description: "Manager with user management access" },
                { name: "Super Admin", permissions: ["read", "write", "delete", "admin"], description: "Full system access" }
            ]
            const createdRoles = await roleModel.insertMany(predefinedRoles)
            console.log(`✅ ${createdRoles.length} predefined roles created successfully!`)
        } else {
            console.log("✅ Roles already exist in database")
        }
    } catch (error) {
        console.log("❌ Error initializing roles:", error)
    }
}

// Database connection
mongoose.connect("mongodb://127.0.0.1:27017/Demo", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("✅ MongoDB connected successfully!")
    setTimeout(initializeRoles, 1000)
})
.catch(err => {
    console.log("❌ MongoDB connection error:", err)
})

// Routes
app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body.user || req.body

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required!" })
        }

        const existingUser = await authModel.findOne({ email })

        if (existingUser) {
            return res.status(409).json({ message: "User already exists!" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await authModel.create({ name, email, password: hashedPassword })
        res.status(201).json({ message: "User created successfully!", userId: newUser._id })
    } catch (error) {
        res.status(500).json({ message: "Error creating user!", error: error.message })
    }
})

app.post("/login", async (req, res) => {
    try {
        const sAdminEmail = "sadmin123@gmail.com"
        const sAdminPassword = "sAdmin@123"

        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required!" })
        }

        if (email === sAdminEmail && password === sAdminPassword) {
            const superToken = jwt.sign({ id: 1001, role: 'superadmin' }, "demo@rnw", { expiresIn: "1h" })
            return res.json({ message: "Super Admin logged in!", token: superToken, superToken, role: 'superadmin' })
        }

        const existingUser = await authModel.findOne({ email, isActive: true }).populate('role')

        if (!existingUser) {
            return res.status(404).json({ message: "User does not exist!" })
        }

        const comparedPass = await bcrypt.compare(password, existingUser.password)

        if (comparedPass) {
            const token = jwt.sign({ id: existingUser._id, role: existingUser.role }, "demo@rnw", { expiresIn: "1h" })
            res.json({ 
                message: `Welcome ${existingUser.name}`, 
                userName: existingUser.name, 
                token, 
                role: existingUser.role 
            })
        } else {
            res.status(401).json({ message: "Email and password do not match!" })
        }
    } catch (error) {
        res.status(500).json({ message: "Login error!", error: error.message })
    }
})

app.post("/forget", async (req, res) => {
    try {
        const { forgetEmail } = req.body

        if (!forgetEmail) {
            return res.status(400).json({ message: "Email is required!" })
        }

        const existingUser = await authModel.findOne({ email: forgetEmail })

        if (!existingUser) {
            return res.status(404).json({ message: "User does not exist!" })
        }

        const createNodeMailer = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "your-email@gmail.com", // Replace with your email
                pass: "your-app-password"      // Replace with your app password
            }
        })

        const otp = Math.floor(100000 + Math.random() * 900000) // 6-digit OTP

        await createNodeMailer.sendMail({
            from: "your-email@gmail.com",
            to: forgetEmail,
            subject: "Reset Password OTP",
            text: `Your OTP (One Time Password) for password reset is: ${otp}`
        })

        existingUser.otp = otp
        await existingUser.save()

        res.json({ message: "OTP sent successfully!", flag: true, forgetEmail })
    } catch (error) {
        console.log("Forget password error:", error)
        res.status(500).json({ message: "Error sending OTP!", error: error.message })
    }
})

app.post("/otpverify", async (req, res) => {
    try {
        const { otp, forgetEmail } = req.body

        if (!otp || !forgetEmail) {
            return res.status(400).json({ message: "OTP and email are required!" })
        }

        const existingUser = await authModel.findOne({ email: forgetEmail })

        if (!existingUser) {
            return res.status(404).json({ message: "User not found!", flag: false })
        }

        if (existingUser.otp == otp) {
            res.json({ message: "OTP verified! You can change your password.", flag: true })
        } else {
            res.status(400).json({ message: "Invalid OTP!", flag: false })
        }
    } catch (error) {
        res.status(500).json({ message: "OTP verification error!", error: error.message })
    }
})

app.post("/resetpassword", async (req, res) => {
    try {
        const { password, forgetEmail } = req.body

        if (!password || !forgetEmail) {
            return res.status(400).json({ message: "Password and email are required!" })
        }

        const existingUser = await authModel.findOne({ email: forgetEmail })

        if (!existingUser) {
            return res.status(404).json({ message: "User not found!", flag: false })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        existingUser.password = hashedPassword
        existingUser.otp = null // Clear OTP after password reset
        await existingUser.save()

        res.json({ message: "Password updated successfully!", flag: true })
    } catch (error) {
        res.status(500).json({ message: "Password reset error!", error: error.message })
    }
})

// Public role endpoint for fetching roles (used in forms)
app.get("/roles", async (req, res) => {
    try {
        const roles = await roleModel.find({ isActive: true })
        console.log(`Found ${roles.length} active roles:`, roles)
        res.json({ message: "Roles fetched!", roles })
    } catch (error) {
        console.log("Error fetching roles:", error)
        res.json({ message: "Error fetching roles!", error: error.message, roles: [] })
    }
})

// User Management with Roles - Protected Routes
app.get("/superAdmin", authenticateSuperAdmin, async (req, res) => {
    try {
        const allUsers = await authModel.find({ isActive: true }).populate('role')
        res.json({ message: "Users fetched!", allUsers })
    } catch (error) {
        res.status(500).json({ message: "Error fetching users!", error: error.message })
    }
})

app.put("/users/:id/role", authenticateSuperAdmin, async (req, res) => {
    const { roleId } = req.body
    try {
        // Update the user role
        await authModel.findByIdAndUpdate(
            req.params.id,
            { role: roleId },
            { new: true }
        )

        // Fetch the updated user with populated role
        const updatedUser = await authModel.findById(req.params.id).populate('role')
        res.json({ message: "User role updated!", user: updatedUser })
    } catch (error) {
        res.status(500).json({ message: "Error updating user role!", error: error.message })
    }
})

app.delete("/users/:id", authenticateSuperAdmin, async (req, res) => {
    try {
        await authModel.findByIdAndUpdate(req.params.id, { isActive: false })
        res.json({ message: "User deleted!" })
    } catch (error) {
        res.status(500).json({ message: "Error deleting user!", error: error.message })
    }
})

// Super Admin - Add New User
app.post("/superAdmin/addUser", authenticateSuperAdmin, async (req, res) => {
    const { name, email, password, roleId } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required!" })
    }

    try {
        const existingUser = await authModel.findOne({ email })
        
        if (existingUser) {
            return res.status(409).json({ message: "User already exists!" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await authModel.create({ 
            name, 
            email, 
            password: hashedPassword,
            role: roleId || null
        })
        
        const populatedUser = await authModel.findById(newUser._id).populate('role')
        res.json({ message: "User created successfully!", user: populatedUser })
    } catch (error) {
        res.status(500).json({ message: "Error creating user!", error: error.message })
    }
})

// Role management routes - Super Admin only
app.post("/roles", authenticateSuperAdmin, async (req, res) => {
    const { name, permissions, description } = req.body
    try {
        const newRole = await roleModel.create({ name, permissions, description })
        res.json({ message: "Role created!", role: newRole })
    } catch (error) {
        res.status(500).json({ message: "Error creating role!", error: error.message })
    }
})

app.put("/roles/:id", authenticateSuperAdmin, async (req, res) => {
    const { name, permissions, description } = req.body
    try {
        const updatedRole = await roleModel.findByIdAndUpdate(
            req.params.id,
            { name, permissions, description },
            { new: true }
        )
        res.json({ message: "Role updated!", role: updatedRole })
    } catch (error) {
        res.status(500).json({ message: "Error updating role!", error: error.message })
    }
})

app.delete("/roles/:id", authenticateSuperAdmin, async (req, res) => {
    try {
        await roleModel.findByIdAndUpdate(req.params.id, { isActive: false })
        res.json({ message: "Role deleted!" })
    } catch (error) {
        res.status(500).json({ message: "Error deleting role!", error: error.message })
    }
})

// Product Management Routes
app.get("/products", authenticateSuperAdmin, async (req, res) => {
    try {
        const products = await productModel.find({ isActive: true })
        res.json({ message: "Products fetched!", products })
    } catch (error) {
        res.status(500).json({ message: "Error fetching products!", error: error.message })
    }
})

app.get("/products/:id", authenticateSuperAdmin, async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id)
        if (!product || !product.isActive) {
            return res.status(404).json({ message: "Product not found!" })
        }
        res.json({ message: "Product fetched!", product })
    } catch (error) {
        res.status(500).json({ message: "Error fetching product!", error: error.message })
    }
})

app.post("/products", authenticateSuperAdmin, async (req, res) => {
    try {
        const { name, price, description, category, image, imagePublicId } = req.body
        if (!name || !price || !description) {
            return res.status(400).json({ message: "Name, price and description are required!" })
        }
        const newProduct = await productModel.create({ 
            name, 
            price, 
            description, 
            category, 
            image, 
            imagePublicId 
        })
        res.status(201).json({ message: "Product added successfully!", product: newProduct })
    } catch (error) {
        res.status(500).json({ message: "Error adding product!", error: error.message })
    }
})

app.put("/products/:id", authenticateSuperAdmin, async (req, res) => {
    try {
        const { name, price, description, category, image, imagePublicId } = req.body
        const updatedProduct = await productModel.findByIdAndUpdate(
            req.params.id,
            { name, price, description, category, image, imagePublicId },
            { new: true }
        )
        res.json({ message: "Product updated successfully!", product: updatedProduct })
    } catch (error) {
        res.status(500).json({ message: "Error updating product!", error: error.message })
    }
})

app.delete("/products/:id", authenticateSuperAdmin, async (req, res) => {
    try {
        await productModel.findByIdAndUpdate(req.params.id, { isActive: false })
        res.json({ message: "Product deleted successfully!" })
    } catch (error) {
        res.status(500).json({ message: "Error deleting product!", error: error.message })
    }
})

app.listen(8080, () => {
    console.log("✅ Server is running on port 8080...")
})