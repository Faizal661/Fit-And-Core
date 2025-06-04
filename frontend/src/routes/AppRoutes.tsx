import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { lazy } from "react";
import ProtectedRoutes from "./ProtectedRoutes";

// 
import PageNotFound from "../components/shared/PageNotFound";
import PaymentSuccessPage from "../pages/shared/PaymentSuccessPage";
import LandingPage from "../pages/user/LandingPage"
import ReportViewPage from "../pages/shared/ReportViewPage";

// authentication
const UserLogin = lazy(() => import("../pages/auth/signin/UserLogin"));
const UserSignUp = lazy(() => import("../pages/auth/signup/RegisterForm"));
const SignUpOtpVerification = lazy(() => import("../pages/auth/signup/OtpVerification"));
const AuthCallback = lazy(() => import("../components/auth/AuthCallback"));
const OtpVerification = lazy(() => import("../pages/auth/forgetPassword/OtpVerification"));
const ForgetPassword = lazy(() => import("../pages/auth/forgetPassword/EmailVerify"));
const NewPassword = lazy(() => import("../pages/auth/forgetPassword/NewPassword"));

// user
const EditArticle = lazy(() => import("../pages/article/trainer/EditArticle"));
const TraineeManagementPage = lazy(() => import("../pages/trainer/trainee-management/TraineeManagementPage"));
const TraineeDetailsPage = lazy(() => import("../pages/trainer/trainee-management/TraineeDetailsPage"));
const UserProgressionPage = lazy(() => import("../pages/progress/UserProgressionPage"));
const UserNutritionTrackingPage = lazy(() => import("../pages/nutrition/UserNutritionPage"));
const SessionManagementPage = lazy(() => import('../pages/session/trainer/SessionManagement'));
const AvailabilitySetupPage = lazy(() => import('../pages/session/trainer/AvailabilitySetup'));
const SlotManagementPage = lazy(() => import('../pages/session/trainer/SlotManagementPage'));
const BookTime = lazy(() => import('../pages/session/user/BookTime'));
const UserSessionManagementPage = lazy(() => import('../pages/session/user/UserSessionManagement'));
const UserProfile = lazy(() => import("../pages/user/UserProfile"));
const TrainersPage = lazy(() => import("../pages/user/find-trainer/TrainersPage"));
const FindTrainersPage = lazy(() => import("../pages/user/find-trainer/FindTrainersPage"));
const TrainerDetailsPage = lazy(() => import("../pages/user/find-trainer/TrainerDetailsPage"));
const TrainerApply = lazy(() => import("../pages/trainer/TrainerApply"));
const UserArticles = lazy(() => import("../pages/article/user/UserArticles"));

// trainer
const HomeTrainer = lazy(() => import("../pages/trainer/HomeTrainer"));
const TrainerArticles = lazy(() => import("../pages/article/trainer/TrainerArticles"));
const CreateArticle = lazy(() => import("../pages/article/trainer/CreateArticle"));

// admin
const HomeAdmin = lazy(() => import("../pages/admin/HomeAdmin"));
const UserManage = lazy(() => import("../pages/admin/UserManage"));
const TrainerManage = lazy(() => import("../pages/admin/TrainerManage"));
const ReportManage = lazy(() => import("../pages/admin/ReportManage"));

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
        <Route path="/progress" element={<UserProgressionPage />} />
        <Route path="/nutrition" element={<UserNutritionTrackingPage />} />
        <Route path="/reports" element={<ReportViewPage />} />
      </Route>

      <Route element={<ProtectedRoutes allowedRoles={["trainer"]} />}>
        <Route path="/trainer" element={<HomeTrainer />} />
        <Route path="/trainer/articles" element={<TrainerArticles />} />
        <Route path="/trainer/articles/create" element={<CreateArticle />} />
        <Route path="/trainer/articles/edit/:articleId" element={<EditArticle />} />
        <Route path="/trainer/sessions" element={<SessionManagementPage />} />
        <Route path="/trainer/slot-management" element={<SlotManagementPage />} />
        <Route path="/trainer/availability-setup" element={<AvailabilitySetupPage />} />
        <Route path="/trainer/trainees-management" element={<TraineeManagementPage />} />
        <Route path="/trainer/trainees/:traineeId" element={<TraineeDetailsPage />} />
        <Route path="/trainer/reports" element={<ReportViewPage />} />
      </Route>

      <Route element={<ProtectedRoutes allowedRoles={["user", "trainer"]} />}>
        <Route path="/article/:id" element={<ArticleFullView />} />
      </Route>

      <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<HomeAdmin />} />
        <Route path="/admin/user-management" element={<UserManage />} />
        <Route path="/admin/trainer-management" element={<TrainerManage />} />
        <Route path="/admin/report-management" element={<ReportManage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

