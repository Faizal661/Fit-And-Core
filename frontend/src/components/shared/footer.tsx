import React from "react";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-gray-800 px-6 md:px-12 lg:px-16 py-16 border-t border-gray-100 text-sm">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-10">
        <div>
          <h3 className="font-medium mb-6 text-xs tracking-wider">ABOUT US</h3>
          <ul className="mt-2 space-y-3">
            <li>About Us</li>
            <li>Contact</li>
            <li>Trainers</li>
            <li>Jobs</li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium mb-6 text-xs tracking-wider">WHAT WE OFFER</h3>
          <ul className="mt-2 space-y-3">
            <li>Communities</li>
            <li>Memberships</li>
            <li>Corporate Deal</li>
            <li>Our App</li>
            <li>Loyalty Program</li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium mb-6 text-xs tracking-wider">READ MORE</h3>
          <ul className="mt-2 space-y-3">
            <li>FAQ</li>
            <li>Fit Friends</li>
            <li>Press</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium mb-6 text-xs tracking-wider">JOIN OUR COMMUNITY</h3>
          <p className="mt-2 text-gray-500">
            Not yet a member of Fit & Core? Register today.
          </p>
          <button className="mt-6 bg-gray-900 text-white px-6 py-2 hover:bg-transparent border-1 border-black hover:text-black hover:cursor-pointer  transition-colors">
            REGISTER
          </button>
          <div className="flex space-x-6 mt-8 text-gray-400">
            <Instagram size={18} className="hover:text-gray-800 transition-colors" />
            <Twitter size={18} className="hover:text-gray-800 transition-colors" />
            <Youtube size={18} className="hover:text-gray-800 transition-colors" />
            <Facebook size={18} className="hover:text-gray-800 transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;