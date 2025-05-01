
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white shadow-sm border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
            <h3 className="font-bold text-rajasthan-orange">Rajasthan Connect</h3>
            <p className="text-sm text-gray-600">
              Alumni-Student Interaction Platform
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Technical Education Department, Govt. of Rajasthan
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-4 mb-2">
              <Link to="/" className="text-sm text-gray-600 hover:text-rajasthan-orange">
                Home
              </Link>
              <Link to="/profiles" className="text-sm text-gray-600 hover:text-rajasthan-orange">
                Profiles
              </Link>
              <Link to="/forum" className="text-sm text-gray-600 hover:text-rajasthan-orange">
                Forum
              </Link>
              <Link to="/contact" className="text-sm text-gray-600 hover:text-rajasthan-orange">
                Contact
              </Link>
            </div>
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Rajasthan Connect. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
