import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-6xl font-light mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-10">Page Not Found</p>
        <button
          type="button"
          className="text-sm px-6 py-3 border border-gray-300 hover:border-gray-800 transition-colors"
          onClick={() => navigate('/')}
        >
          Return Home
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;