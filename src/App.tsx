import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import ProtectedRoute from './components/ProtectedRoute'

function App() {
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
        
        <Route element={<ProtectedRoute requiredRole="staff" />}>
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/staff/verify" element={<StaffDashboard />} />
          <Route path="/staff/chat" element={<StaffChat />} />
        </Route>
        
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
