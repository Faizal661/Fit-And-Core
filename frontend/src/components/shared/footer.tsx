import React from "react";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold mb-6">FIT&CORE</h3>
            <p className="text-gray-400 mb-6">
              Transforming lives through accessible, effective fitness
              solutions for everyone.
            </p>
            <div className="flex space-x-4">
              <Link
                to="#instagram"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="text-whiteh-5 w-5" />
              </Link>
              <Link
                to="#facebook"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="text-white h-5 w-5" />
              </Link>
              <Link
                to="#twitter"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="text-whiteh-5 w-5" />
              </Link>
              <Link
                to="#youtube"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <span className="sr-only">Youtube</span>
                <Youtube className="text-whiteh-5 w-5" />
              </Link>
            </div>
          </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Programs</h4>
              <ul className="space-y-2">
                {["Yoga", "Pilates", "HIIT", "Zumba", "Calisthenics"].map(
                  (program) => (
                    <li key={program}>
                      <Link
                        to={`#programs/${program.toLowerCase()}`}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {program}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Companny</h4>
              <ul className="space-y-2">
                {["About Us", "Careers", "Press", "Partners", "Blog"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        to={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Support</h4>
              <ul className="space-y-2">
                {[
                  "Help Center",
                  "Contact Us",
                  "Privacy Policy",
                  "Terms of Service",
                  "Community Guidelines",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      to={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
            <p>© {new Date().getFullYear()} FIT&CORE. All rights reserved.</p>
            <p className="mt-2">Designed with passion for a healthier world.</p>
          </div>
        </div>
      </footer>
  );
};

export default Footer;