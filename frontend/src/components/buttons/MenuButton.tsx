// import { BellRing } from "lucide-react";
import { HomeIcon } from "lucide-react";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const buttonVariants = {
  initial: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  hover: {
    scale: 1.05,
    boxShadow:
      "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)",
    transition: {
      duration: 0.3,
    },
  },
  tap: {
    scale: 0.98,
  },
};

const MenuButton = () => {
  const navigate = useNavigate();
  const role = useSelector((state: RootState) => state.auth.user?.role) || "";

  return (
    <Fragment>
      <motion.button
        onClick={() => navigate(`/${role}`)}
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        className="fixed top-4 left-4 bg-white text-gray-800 py-2.5 px-5 rounded-lg shadow-lg hover:shadow-sm transition-all cursor-pointer z-52"
      >
        <HomeIcon size={18} />
      </motion.button>
    </Fragment>
  );
};

export default MenuButton;
