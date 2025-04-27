import NotFound from '@src/Components/NotFound'
import AdminDashboard from '@src/Pages/Admin/AdminDashboard'
import { Route, Routes } from 'react-router-dom'

function AdminRoutes() {
    return (
        <Routes>
            <Route path="/admin/Dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />

        </Routes>
    )
}

export default AdminRoutes