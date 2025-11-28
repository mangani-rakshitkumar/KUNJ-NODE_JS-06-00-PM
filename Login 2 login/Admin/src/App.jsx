import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LogIn from './Components/LogIn'
import SignUp from './Components/SignUp'
import './App.css'
import Home from './Components/Home'


const App = () => {
  let token = null;
  try {
    const stored = localStorage.getItem("token");
    token = stored ? JSON.parse(stored) : null;
  } catch (e) {
    token = null;
  }
  console.log("Token:", token ? token.token : null);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={token ? <Home /> : <LogIn />}></Route>
          <Route path='/signup' element={<SignUp />}></Route>
          <Route path='/home' element={<Home />}></Route>
          {/* Fallback route for debugging */}
          <Route path='*' element={<div style={{padding:20, color:'red'}}>No route matched. Check your components and routes.</div>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
