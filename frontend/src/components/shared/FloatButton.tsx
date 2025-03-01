import { CircleUserRound } from "lucide-react";
import { Link } from "react-router-dom";

const FloatButton = () => {
  return (
    <>
      <button className="fixed top-3 right-3  bg-white opacity-90 text-[#2916BA] py-2 px-3 rounded-full flex flex-row hover:bg-slate-300">
        <CircleUserRound />
        <Link to={"/login"}>
          <p className="ml-3 font-bold">Login | fit and core</p>
        </Link>
      </button>
    </>
  );
};

export default FloatButton;
