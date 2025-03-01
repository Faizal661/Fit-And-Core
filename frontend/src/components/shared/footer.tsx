import React from "react";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-black px-40 py-10 text-sm">
      <div className="container mx-auto grid md:grid-cols-4 gap-8  mb-14">
        <div>
          <h3 className="font-bold mb-4">ABOUT US</h3>
          <ul className="mt-2 space-y-1">
            <li>ABOUT US</li>
            <li>CONTACT</li>
            <li>TRAINERS</li>
            <li>JOBS</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4">WHAT WE OFFER</h3>
          <ul className="mt-2 space-y-1">
            <li>COMMUNITIES</li>
            <li>MEMBERSHIPS</li>
            <li>CORPORATE DEAL</li>
            <li>OUR APP</li>
            <li>LOYALITY PROGRAM</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4">READ MORE</h3>
          <ul className="mt-2 space-y-1">
            <li>FAQ</li>
            <li>FIT FRIENDS</li>
            <li>PRESS</li>
            <li>TERMS & CONDITIONS</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4">JOIN OUR COMMUNITY!</h3>
          <p className="mt-2 text-gray-600">
            You are not yet a member of Fit & Core, please register yourself quickly!
          </p>
          <button className="mt-4 bg-[#2916BA] text-white px-6 py-2 rounded-4xl">
            REGISTER NOW
          </button>
          <div className="flex space-x-3 mt-6 text-[#2916BA]">
            <Instagram />
            <Twitter />
            <Youtube/>
            <Facebook />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
