# User Authentication System

A complete MERN stack authentication system with role-based access control.

## Features

- User Registration & Login
- Password Reset with OTP
- Role-based Access Control
- Super Admin Dashboard
- User Management
- JWT Authentication
- MongoDB Integration

## Setup Instructions

### Backend Setup

1. Navigate to the Server directory:
   ```bash
   cd "Day-8 (User Authentication)/Day-8 (User Authentication)/Server"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure email settings in `.env` file:
   - Replace `your-email@gmail.com` with your Gmail address
   - Replace `your-app-password` with your Gmail app password
   - To get Gmail app password: Google Account → Security → 2-Step Verification → App passwords

4. Start MongoDB (make sure MongoDB is running on port 27017)

5. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the Admin directory:
   ```bash
   cd "Day-8 (User Authentication)/Day-8 (User Authentication)/Admin"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Default Credentials

**Super Admin:**
- Email: sadmin@gmail.com
- Password: sAdmin@123

## API Endpoints

### Authentication
- `POST /signup` - User registration
- `POST /login` - User login
- `POST /forget` - Request password reset OTP
- `POST /otpverify` - Verify OTP
- `POST /resetpassword` - Reset password

### User Management (Super Admin only)
- `GET /superAdmin` - Get all users
- `POST /superAdmin/addUser` - Add new user
- `PUT /users/:id/role` - Update user role
- `DELETE /users/:id` - Delete user

### Roles
- `GET /roles` - Get all roles
- `POST /roles` - Create new role (Super Admin only)
- `PUT /roles/:id` - Update role (Super Admin only)
- `DELETE /roles/:id` - Delete role (Super Admin only)

## Project Structure

```
├── Server/
│   ├── Models/
│   │   ├── Auth.js      # User model
│   │   └── Role.js      # Role model
│   ├── index.js         # Main server file
│   ├── package.json
│   └── .env            # Environment variables
└── Admin/
    ├── src/
    │   ├── Components/  # React components
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Nodemailer for email services

### Frontend
- React.js
- React Router
- Axios for API calls
- Tailwind CSS for styling
- Vite for build tool

## Notes

- Make sure MongoDB is running before starting the server
- Update email credentials in the server code for OTP functionality
- The system automatically creates default roles on first run
- All passwords are hashed using bcrypt
- JWT tokens expire in 1 hour