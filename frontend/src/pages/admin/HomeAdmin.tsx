import { Fragment } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdminDashboard from "../../components/admin/AdminDashboard";
import Footer from "../../components/shared/Footer";

const queryClient = new QueryClient();

const HomeAdmin = () => {
  return (
    <Fragment>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen">
          <AdminDashboard />
        </div>
      </QueryClientProvider>
      <Footer />
    </Fragment>
  );
};

export default HomeAdmin;