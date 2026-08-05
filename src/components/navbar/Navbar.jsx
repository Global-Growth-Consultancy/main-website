import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // Import Link and useLocation
import { FaBars, FaTimes } from "react-icons/fa"; // Icons for mobile menu toggle
import EnquiryForm from "../shared/EnquiryForm";

const navItems = ["Home", "About Us", "Courses", "Colleges", "", "7Nischay"];

const Navbar = () => {
  const [activePage, setActivePage] = useState("Home"); // Track active page
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Toggle mobile menu
  const [isFormOpen, setIsFormOpen] = useState(false); // State for EnquiryForm modal

  const location = useLocation();

  // Sync activePage with the current route
  useEffect(() => {
    const path = location.pathname;
    const activeNavItem = navItems.find((item) => {
      if (item === "Home") return path === "/";
      return path === `/${item.toLowerCase().replace(/\s+/g, "-")}`;
    });

    if (activeNavItem) setActivePage(activeNavItem);
  }, [location.pathname]);

  return (
    <div className="w-full py-4 border-b border-gray-900 sticky top-0 bg-gray-700 text-white z-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navbar Container */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/GGC RED.jpeg" className="w-12 h-12 sm:w-16 sm:h-16" alt="logo" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-14 ml-20">
            {navItems.map((item, index) =>
              item.length === 0 ? (
                <div key={index} className="w-[2px] h-7 bg-zinc-600"></div>
              ) : (
                <Link
                  key={index}
                  to={item === "Home" ? "/" : `/${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`font-regular text-sm flex items-center gap-1 cursor-pointer hover:text-green-400 transition-colors ${
                    activePage === item ? "text-green-400" : ""
                  }`}
                  onClick={() => setActivePage(item)}
                >
                  {/* Active Page Indicator */}
                  {activePage === item && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 shadow-md"></span>
                  )}
                  {item}
                </Link>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Desktop Enquiry Button */}
          <div className="hidden md:block">
            <button onClick={() => setIsFormOpen(true)} className="bg-green-500 px-4 py-2 rounded-md">
              Enquiry
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 bg-black p-4 rounded-lg shadow-lg">
            <div className="flex flex-col gap-4">
              {navItems.map((item, index) =>
                item.length === 0 ? (
                  <div key={index} className="w-[2px] h-7 bg-zinc-600"></div>
                ) : (
                  <Link
                    key={index}
                    to={item === "Home" ? "/" : `/${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className={`font-regular text-sm flex items-center gap-1 cursor-pointer hover:text-green-400 transition-colors ${
                      activePage === item ? "text-green-400" : ""
                    }`}
                    onClick={() => {
                      setActivePage(item);
                      setIsMobileMenuOpen(false); // Close menu after clicking
                    }}
                  >
                    {/* Active Page Indicator */}
                    {activePage === item && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 shadow-md"></span>
                    )}
                    {item}
                  </Link>
                )
              )}
            </div>

            {/* Mobile Enquiry Button */}
            <div className="mt-4">
              <button onClick={() => setIsFormOpen(true)} className="w-full bg-green-500 py-2 rounded-md">
                Enquiry
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enquiry Form Modal */}
      {isFormOpen && <EnquiryForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />}
    </div>
  );
};

export default Navbar;
