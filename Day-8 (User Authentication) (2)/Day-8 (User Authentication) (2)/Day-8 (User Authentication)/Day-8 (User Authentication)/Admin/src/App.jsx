import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Cookies from "js-cookie"
import Login from './Components/Login'
import Signup from './Components/Signup'
import UserDash from './Components/UserDash'
import ProtectedRoute from './ProtectedRoute'
import AdminProtectedRoute from './AdminProtectedRoute'
import ForgetPass from './Components/ForgetPass'
import OtpVerify from './Components/OtpVerify'
import ResetPass from './Components/ResetPass'
import SAdmin from './admin/SAdmin'
import AddProduct from './admin/AddProduct'
import EditProduct from './admin/EditProduct'
import ProductList from './admin/ProductList'


const App = () => {

  const token = Cookies.get("token")
  const superToken = Cookies.get("superToken")
  console.log("User token:", token)
  console.log("Super token:", superToken)

  return (
    <>
      <BrowserRouter>
        <Routes>

          {/* Home Route - Always Login */}
          <Route path='/' element={<Login />} />

          {/* Signup */}
          <Route path='/signup' element={<Signup />} />

          {/* User Dashbord */}
          <Route path='/user' element={
            <ProtectedRoute>
              <UserDash />
            </ProtectedRoute>
          } />

          {/* Forget Password */}
          <Route path='/forget' element={<ForgetPass />} />

          <Route path='/otpverify' element={<OtpVerify />} />

          <Route path='/resetpass' element={<ResetPass />} />

          {/* Admin Routes */}
          <Route path='/superadmin' element={
            <AdminProtectedRoute>
              <SAdmin />
            </AdminProtectedRoute>
          } />
          <Route path='/admin/add' element={
            <AdminProtectedRoute>
              <AddProduct />
            </AdminProtectedRoute>
          } />
          <Route path='/admin/products' element={
            <AdminProtectedRoute>
              <ProductList />
            </AdminProtectedRoute>
          } />
          <Route path='/admin/edit/:id' element={
            <AdminProtectedRoute>
              <EditProduct />
            </AdminProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
