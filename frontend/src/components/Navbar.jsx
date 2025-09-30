// src/components/Navbar.jsx
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-primary-500 to-secondary-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-8 mr-2"
                src="/logo.svg"
                alt="Qdemy Logo"
              />
              <span className="text-white font-bold text-xl">Qdemy</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className="text-white hover:bg-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Events
              </Link>
              <a
                href="#"
                className="text-white hover:bg-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Certificates
              </a>
              <a
                href="#"
                className="text-white hover:bg-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;