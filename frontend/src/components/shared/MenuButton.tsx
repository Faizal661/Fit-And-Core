import { Bell, BellRing, Menu, NotebookIcon } from 'lucide-react';

const MenuButton = () => {
  return (
    <>
      <button className="fixed top-3 left-5  bg-amber-50 text-[#2916BA] p-2 rounded-full z-50  border-b-2 border-b-amber-500 border-t-2 border-t-fuchsia-500 border-l-2 border-l-red-500 border-r-2 border-r-green-400 cursor-pointer">
        <BellRing />
      </button>
    </>
  )
}

export default MenuButton