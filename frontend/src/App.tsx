import { Routes, Route, Navigate } from "react-router-dom";
import UserLogin from "./pages/auth/UserLogin";
import UserSignUp from "./pages/auth/signup/UserSignUp.tsx";
import Footer from "./components/shared/Footer";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import ForgetPassword from "./pages/auth/resetPassword/ResetPassword.tsx";
import SetPassword from "./pages/auth/signup/SetPassword.tsx";
import FloatButton from "../src/components/shared/FloatButton";
import MenuButton from "../src/components/shared/MenuButton";
import LandingPage from "./pages/user/LandingPage";
import Loader from "./components/shared/Loader";
import ToastContainer from "./components/shared/ToastContainer.tsx";
import AuthCallback from "./components/auth/AuthCallback.tsx";
import PrivateRoute from "./components/auth/PrivateRoute .tsx";
import HomeTrainer from "./pages/trainer/HomeTrainer.tsx";
import HomeAdmin from "./pages/admin/HomeAdmin.tsx";
import UserManage from "./pages/admin/UserManage.tsx";
import UserProfile from "./pages/user/UserProfile.tsx";
import PageNotFound from "./components/shared/PageNotFound.tsx";
import TrainerApply from "./pages/trainer/TrainerApply.tsx";
import OtpVerification from "./pages/auth/resetPassword/OtpVerification.tsx";
import NewPassword from "./pages/auth/resetPassword/NewPassword.tsx";

function App() {
  const user = useSelector((state: RootState) => state.auth.user);
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  return (
    <div className="min-h-screen flex flex-col">
      {isLoading && <Loader />}
      <ToastContainer />
      <MenuButton />
      <FloatButton />

      <Routes>
        <Route element={<PrivateRoute allowedRoles={["user"]} />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/user" element={<Navigate to="/" />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/trainer/apply" element={<TrainerApply />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={["trainer"]} />}>
          <Route path="/trainer" element={<HomeTrainer />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<HomeAdmin />} />
          <Route path="/admin/users" element={<UserManage />} />
        </Route>

        <Route path="/login" element={user ? <Navigate to={`/${user.role}`} /> : <UserLogin />} />
        <Route path="/signup" element={user ? <Navigate to={`/${user.role}`} />: <UserSignUp />} />
        <Route path="/auth/success" element={<AuthCallback />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/forget-password" element={<ForgetPassword />}/>
        <Route path="/otp-verify" element={<OtpVerification />} />
        <Route path="/new-reset-password" element={<NewPassword />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
