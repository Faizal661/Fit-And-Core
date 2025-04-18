// import { BellRing } from "lucide-react";
import { HomeIcon } from "lucide-react";
import { Fragment } from 'react';
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useNavigate } from "react-router-dom";

const MenuButton = () => {
  const navigate = useNavigate();
  const role = useSelector((state: RootState) => state.auth.user?.role) || '';
  
  return (
    <Fragment>
      <button
        className="fixed top-4 left-4 bg-white text-gray-800 p-2 shadow-sm hover:shadow-md transition-all cursor-pointer z-50"
        onClick={() => navigate(`/${role}`)}
      >
        <HomeIcon size={18} />
      </button>
    </Fragment>
  );
};

export default MenuButton;