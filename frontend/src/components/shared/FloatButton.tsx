import { CircleUserRound } from "lucide-react";

const FloatButton = () => {
  return (
    <>
      <button className="fixed top-3 right-3  bg-amber-50 text-[#2916BA] py-2 px-3 rounded-full flex flex-row">
        <CircleUserRound />
        <p className="ml-3 font-bold">Login | fit and core</p>
      </button>
    </>
  );
};

export default FloatButton;
