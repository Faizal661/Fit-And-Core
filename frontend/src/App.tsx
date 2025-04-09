import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

// authentication
import UserLogin from "./pages/auth/signin/UserLogin.tsx";
import UserSignUp from "./pages/auth/signup/RegisterForm.tsx";
import SignUpOtpVerification from "./pages/auth/signup/OtpVerification.tsx";
import AuthCallback from "./components/auth/AuthCallback.tsx";
import OtpVerification from "./pages/auth/forgetPassword/OtpVerification.tsx";
import ForgetPassword from "./pages/auth/forgetPassword/EmailVerify.tsx";
import NewPassword from "./pages/auth/forgetPassword/NewPassword.tsx";
import PrivateRoute from "./components/auth/PrivateRoute .tsx";
// shared component
import Loader from "./components/shared/Loader";
import Footer from "./components/shared/Footer";
import MenuButton from "../src/components/shared/MenuButton";
import FloatButton from "../src/components/shared/FloatButton";
import PageNotFound from "./components/shared/PageNotFound.tsx";
import ToastContainer from "./components/shared/customToast/ToastContainer.tsx";
// user 
import LandingPage from "./pages/user/LandingPage";
import UserProfile from "./pages/user/UserProfile.tsx";
// trainer
import HomeTrainer from "./pages/trainer/HomeTrainer.tsx";
import TrainerArticles from "./pages/article/TrainerArticles.tsx";
import TrainerApply from "./pages/trainer/TrainerApply.tsx";
// admin
import HomeAdmin from "./pages/admin/HomeAdmin.tsx";
import UserManage from "./pages/admin/UserManage.tsx";
import TrainerManage from "./pages/admin/TrainerManage.tsx";
import CreateArticle from "./pages/article/CreateArticle.tsx";
import ErrorBoundary from "./components/shared/errorBoundary.tsx";
import ArticleFullView from "./pages/article/ArticleFullView.tsx";
import UserArticles from "./pages/article/UserArticles.tsx";


function App() {
  const user = useSelector((state: RootState) => state.auth.user);
  // const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  return (
    <div className="min-h-screen flex flex-col">
      {/* {isLoading && <Loader />} */}
      <ToastContainer />
      <MenuButton />
      <FloatButton />

      <Routes>
        <Route element={<PrivateRoute allowedRoles={["user"]} />}>
          <Route path="/user" element={<Navigate to="/" />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/trainer/apply" element={<TrainerApply />} />
          <Route path="/articles" element={<ErrorBoundary>< UserArticles /></ErrorBoundary >} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={["trainer"]} />}>
          <Route path="/trainer" element={<HomeTrainer />} />
          <Route path="/trainer/articles" element={<ErrorBoundary>< TrainerArticles /></ErrorBoundary >} />
          <Route path="/trainer/articles/create" element={< CreateArticle />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={["user","trainer"]} />}>
          <Route path="/article/:id" element={<ErrorBoundary>< ArticleFullView /></ErrorBoundary >} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<HomeAdmin />} />
          <Route path="/admin/user-management" element={<UserManage />} />
          <Route path="/admin/trainer-management" element={<TrainerManage />} />
        </Route>

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={user ? <Navigate to={`/${user.role}`} /> : <UserLogin />} />
        <Route path="/signup" element={user ? <Navigate to={`/${user.role}`} />: <UserSignUp />} />
        <Route path="/signup/verify-otp" element={<SignUpOtpVerification />} />
        <Route path="/auth/success" element={<AuthCallback />} />
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
