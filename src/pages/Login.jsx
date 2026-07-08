import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Key, Mail, ShieldAlert, Sparkles, UserCheck } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  // Login Form States
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Forgot password flow
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotError, setForgotError] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const loggedInUser = await login(username, password);
      if (loggedInUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      setError(err.message || "Invalid credentials. Please verify.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotSuccess("");
    setForgotError("");
    try {
      // POST forgot password
      const res = await fetch("/api/forgot-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setForgotSuccess(data.message);
      setForgotEmail("");
    } catch (err) {
      setForgotError(err.message || "Email address not found.");
    }
  };

  // Auto-login demo accounts for easy tester access
  const handleQuickLogin = async (role) => {
    setLoading(true);
    setError("");
    try {
      let loggedInUser;
      if (role === "admin") {
        setUsername("admin@vehiclerental.com");
        setPassword("adminpassword");
        loggedInUser = await login("admin@vehiclerental.com", "adminpassword");
      } else {
        setUsername("john@gmail.com");
        setPassword("userpassword");
        loggedInUser = await login("john@gmail.com", "userpassword");
      }
      if (loggedInUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      setError(err.message || "Invalid credentials. Please verify.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans flex items-center justify-center relative overflow-hidden" id="login-page">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-600/5 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="max-w-md w-full space-y-8 bg-white border border-slate-200 p-8 rounded-3xl shadow-lg relative z-10">
        
        {/* Title */}
        <div className="text-center">
          <span className="inline-block bg-indigo-50 text-indigo-600 font-mono text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3">
            Secure Portal login
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 uppercase">Welcome Back</h2>
          <p className="text-xs text-slate-500 mt-2">Access your luxury vehicle dashboard to monitor reservation schedules.</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-start space-x-2 animate-fadeIn">
            <ShieldAlert className="h-4 w-4 text-rose-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-rose-600 font-mono">{error}</p>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">USERNAME OR EMAIL</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@vehiclerental.com or john_doe"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">PASSWORD</label>
            <div className="relative">
              <Key className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded accent-indigo-600 text-black border-slate-300 focus:outline-none cursor-pointer"
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => {
                setForgotSuccess("");
                setForgotError("");
                setShowForgotModal(true);
              }}
              className="text-indigo-600 hover:text-indigo-500 underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white hover:bg-indigo-500 font-bold py-3 rounded-xl text-sm transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
            id="login-submit-button"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        {/* Quick Playground Login Shortcuts */}
        <div className="border-t border-slate-100 pt-6 space-y-3">
          <p className="text-center text-[10px] font-mono text-slate-400 uppercase tracking-wider">⚡ Playground Easy Testing Accounts</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin("admin")}
              className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-indigo-600 rounded-xl flex items-center justify-center space-x-1 cursor-pointer"
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Tester Admin</span>
            </button>
            <button
              onClick={() => handleQuickLogin("customer")}
              className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl flex items-center justify-center space-x-1 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Tester Customer</span>
            </button>
          </div>
        </div>

        {/* Register Prompt */}
        <p className="text-center text-xs text-slate-500 pt-2">
          New to the platform?{" "}
          <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-semibold underline">
            Register an Account
          </Link>
        </p>

      </div>

      {/* Forgot Password Modal overlay */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 max-w-sm w-full rounded-2xl p-6 relative shadow-xl">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 cursor-pointer text-lg"
            >
              ✕
            </button>
            <h3 className="text-slate-900 font-extrabold text-base mb-2 uppercase">Reset Password</h3>
            <p className="text-xs text-slate-500 mb-4">Enter your registered email below, and we'll transmit a mock security token reset link.</p>
            
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <input
                type="email"
                required
                placeholder="name@gmail.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              />

              {forgotSuccess && <p className="text-emerald-600 text-xs font-mono">{forgotSuccess}</p>}
              {forgotError && <p className="text-rose-600 text-xs font-mono">{forgotError}</p>}

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-sm cursor-pointer hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/10"
              >
                Send Password Reset link
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
