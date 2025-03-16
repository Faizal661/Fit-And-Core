import { Routes, Route, Navigate } from "react-router-dom";
import UserLogin from "./pages/auth/UserLogin";
import UserSignUp from "./pages/auth/signup/UserSignUp.tsx";
import Footer from "./components/shared/Footer";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import ForgetPassword from "./pages/auth/ResetPassword";
import SetPassword from "./pages/auth/signup/SetPassword.tsx";
// import OtpVerification from "./pages/auth/OtpVerification";
import FloatButton from "../src/components/shared/FloatButton";
import MenuButton from "../src/components/shared/MenuButton";
import LandingPage from "./pages/user/LandingPage";
import Loader from "./components/shared/Loader";
import ToastContainer from "./components/shared/ToastContainer.tsx";
import AuthCallback from "./components/auth/AuthCallback.tsx";

function App() {
  const user = useSelector((state: RootState) => state.auth.user?.username);
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  return (
    <div className="min-h-screen flex flex-col">
      {isLoading && <Loader />}
      <ToastContainer/>
      <MenuButton />
      <FloatButton />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={user ? <LandingPage /> : <UserLogin />} />
        <Route path="/auth/success" element={<AuthCallback />} />
        <Route path="/signup" element={user ? <LandingPage /> : <UserSignUp />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/set-password" element={<SetPassword />} />


        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
