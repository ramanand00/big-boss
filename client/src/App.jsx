import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOtp from "./pages/VerifyOtp";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import { isLoggedIn } from "./utils/auth";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isLoggedIn() ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
