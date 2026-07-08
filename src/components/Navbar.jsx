import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Car, Menu, X, User, LogOut, LayoutDashboard, Shield, History } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path ? "text-indigo-600 font-semibold" : "text-slate-600 hover:text-indigo-600 transition-colors";
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-slate-900 group" id="nav-logo">
            <div className="bg-indigo-600 p-2 rounded-xl group-hover:bg-indigo-500 transition-colors">
              <Car className="h-5 w-5 text-white" />
            </div>
            <span className="font-sans font-bold text-lg tracking-wider text-slate-900 uppercase">
              Vehicle<span className="text-indigo-600">Rental</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={isActive("/")} id="nav-link-home">Home</Link>
            <Link to="/vehicles" className={isActive("/vehicles")} id="nav-link-vehicles">Browse Vehicles</Link>

            {user && user.role === "customer" && (
              <Link to="/dashboard" className={isActive("/dashboard")} id="nav-link-user-dash">My Dashboard</Link>
            )}

            {user && user.role === "admin" && (
              <Link to="/admin" className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-500 font-semibold" id="nav-link-admin-dash">
                <Shield className="h-4 w-4" />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </div>

          {/* User Section (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-slate-800 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none"
                  id="user-menu-button"
                >
                  <div className="bg-indigo-50 p-1 rounded-full text-indigo-600">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-sm text-slate-800">{user.username}</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-fadeIn" id="user-dropdown-menu">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-mono">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-900 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] bg-indigo-50 text-indigo-600 font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        {user.role}
                      </span>
                    </div>

                    {user.role === "customer" ? (
                      <>
                        <Link
                          to="/dashboard"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center space-x-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                          id="dropdown-dashboard"
                        >
                          <LayoutDashboard className="h-4 w-4 text-slate-400" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          to="/dashboard?tab=bookings"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center space-x-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                          id="dropdown-bookings"
                        >
                          <History className="h-4 w-4 text-slate-400" />
                          <span>My Bookings</span>
                        </Link>
                      </>
                    ) : (
                      <Link
                        to="/admin"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center space-x-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                        id="dropdown-admin"
                      >
                        <LayoutDashboard className="h-4 w-4 text-slate-400" />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 border-t border-slate-100 text-left"
                      id="dropdown-logout"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-indigo-600 text-sm font-medium px-4 py-2 rounded-lg"
                  id="nav-login-btn"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white hover:bg-indigo-500 text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/10"
                  id="nav-register-btn"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none p-1 bg-slate-100 border border-slate-200 rounded-lg"
              id="mobile-menu-button"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3 z-50 absolute left-0 right-0 shadow-xl" id="mobile-menu">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium"
          >
            Home
          </Link>
          <Link
            to="/vehicles"
            onClick={() => setIsOpen(false)}
            className="block text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium"
          >
            Browse Vehicles
          </Link>

          {user && user.role === "customer" && (
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="block text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium"
            >
              My Dashboard
            </Link>
          )}

          {user && user.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="block text-indigo-600 font-semibold px-3 py-2 rounded-md"
            >
              Admin Panel
            </Link>
          )}

          <div className="pt-4 border-t border-slate-100">
            {user ? (
              <div className="space-y-2">
                <p className="px-3 text-xs text-slate-400 font-mono truncate">Signed in as: {user.email}</p>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center space-x-2 text-left text-red-600 hover:bg-slate-50 px-3 py-2 rounded-md font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 px-3">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-center text-slate-600 hover:text-indigo-600 font-medium py-2 rounded-lg"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="text-center bg-indigo-600 text-white hover:bg-indigo-500 font-semibold py-2 rounded-xl transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
