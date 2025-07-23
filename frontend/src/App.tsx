import { Suspense } from "react";
import AppRoutes from "./routes/AppRoutes.tsx";

// shared component
import MenuButton from "./components/buttons/MenuButton.tsx";
import FloatButton from "./components/buttons/FloatButton.tsx";
import Loader from "./components/shared/Loader";
import ToastContainer from "./components/shared/customToast/ToastContainer.tsx";
import ScrollToTop from "./components/shared/ScrollToTop.tsx";
import ErrorBoundary from "./components/shared/error/errorBoundary.tsx";
import Notifications from "./components/shared/Notifications.tsx";
import { CallingAlert } from "./components/session/CallingAlert.tsx";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <MenuButton />
      <Notifications />
      <CallingAlert />
      <FloatButton />
      <ToastContainer />
      <Suspense fallback={<Loader />}>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}

export default App;
