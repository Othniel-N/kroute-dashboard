import './assets/libs/boxicons-2.1.1/css/boxicons.min.css'
import './scss/App.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Blank from './pages/Blank'
import Dashboard from './pages/Dashboard'
import MainLayout from './layout/MainLayout'
import Home from './pages/Home'
import Services from './pages/Services'
import Pendingpodpage from './pages/Pendingpodpage'
import Alertsslack from './pages/Alertsslack'
import Loginpage from './pages/Loginpage'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="orders" element={<Blank />} />
                    <Route path="services" element={<Services/>} />
                    <Route path="pendingpods" element={<Pendingpodpage/>} />
                    <Route path="settings" element={<Loginpage/>} />
                    <Route path="alerts" element={<Alertsslack />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
