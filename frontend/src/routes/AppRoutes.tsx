import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { lazy } from "react";
import ProtectedRoutes from "./ProtectedRoutes";

// shared component
import PageNotFound from "../components/shared/PageNotFound";
import PaymentSuccessPage from "../pages/shared/PaymentSuccessPage";

// authentication
const UserLogin = lazy(() => import("../pages/auth/signin/UserLogin"));
const UserSignUp = lazy(() => import("../pages/auth/signup/RegisterForm"));
const SignUpOtpVerification = lazy(() => import("../pages/auth/signup/OtpVerification"));
const AuthCallback = lazy(() => import("../components/auth/AuthCallback"));
const OtpVerification = lazy(() => import("../pages/auth/forgetPassword/OtpVerification"));
const ForgetPassword = lazy(() => import("../pages/auth/forgetPassword/EmailVerify"));
const NewPassword = lazy(() => import("../pages/auth/forgetPassword/NewPassword"));

// user
import LandingPage from "../pages/user/LandingPage"
import SessionManagementPage from "../pages/session/SessionManagement";
import AvailabilitySetupPage from "../pages/session/AvailabilitySetup";
import BookTime from "../pages/session/BookTime";
import UserSessionManagementPage from "../pages/session/user/UserSessionManagement";
import SlotManagementPage from "../pages/session/trainer/SlotManagementPage";
const UserProfile = lazy(() => import("../pages/user/UserProfile"));
const TrainersPage = lazy(() => import("../pages/user/find-trainer/TrainersPage"));
const FindTrainersPage = lazy(() => import("../pages/user/find-trainer/FindTrainersPage"));
const TrainerDetailsPage = lazy(() => import("../pages/user/find-trainer/TrainerDetailsPage"));
const TrainerApply = lazy(() => import("../pages/trainer/TrainerApply"));
const UserArticles = lazy(() => import("../pages/article/UserArticles"));

// trainer
const HomeTrainer = lazy(() => import("../pages/trainer/HomeTrainer"));
const TrainerArticles = lazy(() => import("../pages/article/TrainerArticles"));
const CreateArticle = lazy(() => import("../pages/article/CreateArticle"));

// admin
const HomeAdmin = lazy(() => import("../pages/admin/HomeAdmin"));
const UserManage = lazy(() => import("../pages/admin/UserManage"));
const TrainerManage = lazy(() => import("../pages/admin/TrainerManage"));

// public
const ArticleFullView = lazy(() => import("../pages/article/ArticleFullView"));

const AppRoutes = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to={`/${user.role}`} /> : <UserLogin />} />
      <Route path="/signup" element={user ? <Navigate to={`/${user.role}`} /> : <UserSignUp />} />
      <Route path="/signup/verify-otp" element={<SignUpOtpVerification />} />
      <Route path="/auth/success" element={<AuthCallback />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/otp-verify" element={<OtpVerification />} />
      <Route path="/new-reset-password" element={<NewPassword />} />
      <Route path="/payment-success" element={<PaymentSuccessPage />} />
      <Route path="*" element={<PageNotFound />} />

      <Route element={<ProtectedRoutes allowedRoles={["user"]} />}>
        <Route path="/user" element={<Navigate to="/" />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/trainers" element={<TrainersPage />} />
        <Route path="/find-trainers" element={<FindTrainersPage />} />
        <Route path="/trainer/:trainerId" element={<TrainerDetailsPage />} />
        <Route path="/trainer/apply" element={<TrainerApply />} />
        <Route path="/book-time/:trainerId" element={<BookTime />} />
        <Route path="/session-details/:trainerId" element={<UserSessionManagementPage />} />
        <Route path="/articles" element={<UserArticles />} />
      </Route>

      <Route element={<ProtectedRoutes allowedRoles={["trainer"]} />}>
        <Route path="/trainer" element={<HomeTrainer />} />
        <Route path="/trainer/articles" element={<TrainerArticles />} />
        <Route path="/trainer/articles/create" element={<CreateArticle />} />
        <Route path="/trainer/sessions" element={<SessionManagementPage />} />
        <Route path="/trainer/slot-management" element={<SlotManagementPage />} />
        <Route path="/trainer/availability-setup" element={<AvailabilitySetupPage />} />

      </Route>

      <Route element={<ProtectedRoutes allowedRoles={["user", "trainer"]} />}>
        <Route path="/article/:id" element={<ArticleFullView />} />
      </Route>

      <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<HomeAdmin />} />
        <Route path="/admin/user-management" element={<UserManage />} />
        <Route path="/admin/trainer-management" element={<TrainerManage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

