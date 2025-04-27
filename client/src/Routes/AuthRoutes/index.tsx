import NotFound from "@src/Components/NotFound"
import Home from "@src/Pages/Auth/Home"
import Login from "@src/Pages/Auth/Login"
import Signup from "@src/Pages/Auth/Signup"
import { Route, Routes } from "react-router-dom"

function AuthRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} />

        </Routes>
    )
}

export default AuthRoutes
