import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
    const navigate = useNavigate();

  return (
    <div className="h-screen  flex justify-center items-center text-5xl font-bold">
      <div className="text-center ">
        <div>Page Not Found</div>
        <div className="my-7">404</div>
        <button
            type="button"
            className="text-2xl border-1 rounded-4xl border-slate-400 p-1 px-9  cursor-pointer"
            onClick={() => navigate('/') }
          >Home</button>
      </div>
    </div>
  );
};

export default PageNotFound;
