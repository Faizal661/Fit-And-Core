import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { lazy, Suspense } from "react";

// authentication
const UserLogin = lazy(() => import("./pages/auth/signin/UserLogin.tsx"));
const UserSignUp = lazy(() => import("./pages/auth/signup/RegisterForm.tsx"));
const SignUpOtpVerification = lazy(() => import("./pages/auth/signup/OtpVerification.tsx"));
const AuthCallback = lazy(() => import("./components/auth/AuthCallback.tsx"));
const OtpVerification = lazy(() => import("./pages/auth/forgetPassword/OtpVerification.tsx"));
const ForgetPassword = lazy(() => import("./pages/auth/forgetPassword/EmailVerify.tsx"));
const NewPassword = lazy(() => import("./pages/auth/forgetPassword/NewPassword.tsx"));
import PrivateRoute from "./components/auth/PrivateRoute .tsx";

// shared component
import Loader from "./components/shared/Loader";
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
import TrainersPage from "./pages/user/find-trainer/TrainersPage.tsx";
import FindTrainersPage from "./pages/user/find-trainer/FindTrainersPage.tsx";
import TrainerDetailsPage from "./pages/user/find-trainer/TrainerDetailsPage.tsx";
import ScrollToTop from "./components/shared/ScrollToTop.tsx";
import PaymentSuccessPage from "./pages/shared/PaymentSuccessPage.tsx";


function App() {
  const user = useSelector((state: RootState) => state.auth.user);
  // const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  return (
    <div className="min-h-screen flex flex-col">
      {/* {isLoading && <Loader />} */}
      <ScrollToTop/>
      <ToastContainer />
      <MenuButton />
      <FloatButton />
      <Suspense fallback={<Loader/>}>
        <Routes>
          <Route element={<PrivateRoute allowedRoles={["user"]} />}>
            <Route path="/user" element={<Navigate to="/" />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/trainers" element={<ErrorBoundary><TrainersPage /></ErrorBoundary >} />
            <Route path="/find-trainers" element={<ErrorBoundary><FindTrainersPage /></ErrorBoundary >} />
            <Route path="/trainer/:trainerId" element={<ErrorBoundary><TrainerDetailsPage /></ErrorBoundary >} />
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
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
