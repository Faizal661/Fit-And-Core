import { Menu } from 'lucide-react';

const MenuButton = () => {
  return (
    <>
      <button className="fixed top-3 left-5  bg-amber-50 text-[#2916BA] p-2 rounded-full z-50">
        <Menu />
      </button>
    </>
  )
}

export default MenuButton