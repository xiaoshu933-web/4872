import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Lottery from './pages/Lottery'
import MerchantApply from './pages/MerchantApply'
import VisitorLogin from './pages/VisitorLogin'
import MerchantLogin from './pages/MerchantLogin'
import AdminLogin from './pages/AdminLogin'
import MyPage from './pages/MyPage'
import StaffLogin from './pages/StaffLogin'
import StaffDashboard from './pages/StaffDashboard'
import StaffChat from './pages/StaffChat'
import AdminDashboard from './pages/AdminDashboard'
import Chat from './pages/Chat'
import Layout from './components/Layout'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (token && role) {
      setIsAuthenticated(true)
      setUserRole(role)
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="lottery" element={<Lottery />} />
          <Route path="merchant" element={<MerchantApply />} />
          <Route path="my" element={<MyPage />} />
          <Route path="chat" element={<Chat />} />
        </Route>
        <Route path="/visitor/login" element={<VisitorLogin />} />
        <Route path="/merchant/login" element={<MerchantLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/verify" element={<StaffDashboard />} />
        <Route path="/staff/chat" element={<StaffChat />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
