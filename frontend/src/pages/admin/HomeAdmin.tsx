import { Fragment } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdminDashboard from "../../components/admin/AdminDashboard";

const queryClient = new QueryClient();

const HomeAdmin = () => {
  return (
    <Fragment>
      <QueryClientProvider client={queryClient}>
        <div className="bg-gray-100 min-h-screen">
          <AdminDashboard />
        </div>
      </QueryClientProvider>
    </Fragment>
  );
};

export default HomeAdmin;