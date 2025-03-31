// import { BellRing } from "lucide-react";
import { HomeIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Fragment } from 'react';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";


const MenuButton = () => {
  const navigate=useNavigate()
  const role= useSelector((state:RootState) => state.auth.user?.role)
  return (
    <Fragment>
        <button
          className="fixed top-3 left-5  bg-amber-50 text-[#2916BA] p-2 rounded-full z-50  border-b-2 border-b-amber-500 border-t-2 border-t-fuchsia-500 border-l-2 border-l-red-500 border-r-2 border-r-green-400 cursor-pointer"
          onClick={()=>navigate(`/${role}`)}
          >
          <HomeIcon />
        </button>
    </Fragment>
  );
};

export default MenuButton;