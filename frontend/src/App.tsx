import { Routes, Route, Navigate } from "react-router-dom";
import UserLogin from "./pages/auth/UserLogin";
import TrainerLogin from "./pages/auth/TrainerLogin";
import AdminLogin from "./pages/auth/AdminLogin";
import UserSignUp from "./pages/auth/UserSignUp";
import Home from "./pages/user/Home";
import Footer from "./components/shared/Footer";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import ForgetPassword from "./pages/auth/ResetPassword";
import SetPassword from "./pages/auth/SetPassword";
import OtpVerification from "./pages/auth/OtpVerification";
import FloatButton from "../src/components/shared/FloatButton";
import MenuButton from "../src/components/shared/MenuButton";

function App() {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <div className="min-h-screen flex flex-col">
      <MenuButton />
      <FloatButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Home /> : <UserLogin />} />
        <Route path="/signup" element={<UserSignUp />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/otp-verify" element={<OtpVerification />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/trainer/login" element={<TrainerLogin />} />
        {/* <Route path="/trainer/login" element={<TrainerLogin />} /> */}
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
