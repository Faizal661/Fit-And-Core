import { Suspense } from "react";
import AppRoutes from "./routes/AppRoutes.tsx";

// shared component
import MenuButton from "./components/shared/buttons/MenuButton.tsx";
import FloatButton from "./components/shared/buttons/FloatButton.tsx";
import Loader from "./components/shared/Loader";
import ToastContainer from "./components/shared/customToast/ToastContainer.tsx";
import ScrollToTop from "./components/shared/ScrollToTop.tsx";
import ErrorBoundary from "./components/shared/errorBoundary.tsx";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <ToastContainer />
      <MenuButton />
      <FloatButton />
      <Suspense fallback={<Loader />}>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}

export default App;
