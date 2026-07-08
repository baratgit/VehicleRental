import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Car, Mail, Phone, MapPin, ShieldCheck, CreditCard, Clock, Sparkles } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 font-sans" id="app-footer">
      {/* Top Value Proposition Grid */}
      <div className="border-b border-slate-800/60 bg-slate-950/20 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-500/10 p-3 rounded-xl text-indigo-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Fully Insured Fleet</h4>
              <p className="text-xs text-slate-500">Drive with complete peace of mind</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-500/10 p-3 rounded-xl text-indigo-400">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Flexible Cancellations</h4>
              <p className="text-xs text-slate-500">Free changes up to 24h before</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-500/10 p-3 rounded-xl text-indigo-400">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Secure Transactions</h4>
              <p className="text-xs text-slate-500">Razorpay protected checkouts</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-500/10 p-3 rounded-xl text-indigo-400">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Premium Sanitzation</h4>
              <p className="text-xs text-slate-500">Deep cleaned before every delivery</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-white">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <Car className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-wider text-white uppercase">
              Vehicle<span className="text-indigo-400">Rental</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Leading luxury and smart rental platform in the country. Rent high performance sports cars, luxury electric vehicles, and powerful cruisers instantly.
          </p>
          <div className="pt-2">
            <span className="inline-block bg-slate-950/60 border border-slate-800 text-xs px-3 py-1.5 rounded-lg text-indigo-400 font-mono">
              ★ Active Fleet Support 24/7
            </span>
          </div>
        </div>

        {/* Categories / Links */}
        <div>
          <h3 className="text-white font-semibold text-sm tracking-widest uppercase mb-4">Categories</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/vehicles?category=Luxury" className="hover:text-white transition-colors">Luxury Sedans</Link></li>
            <li><Link to="/vehicles?category=Sports" className="hover:text-white transition-colors">Sports Coupes</Link></li>
            <li><Link to="/vehicles?category=Electric" className="hover:text-white transition-colors">Electric Vehicles (EV)</Link></li>
            <li><Link to="/vehicles?type=bike" className="hover:text-white transition-colors">Adventure Cruiser Bikes</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-semibold text-sm tracking-widest uppercase mb-4">Contact Info</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start space-x-3">
              <MapPin className="h-4 w-4 text-indigo-400 mt-1 flex-shrink-0" />
              <span>100 Connaught Place, New Delhi, 110001, India</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-indigo-400 flex-shrink-0" />
              <span>+91 (11) 4983-2947</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-indigo-400 flex-shrink-0" />
              <span>support@vehiclerental.com</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white font-semibold text-sm tracking-widest uppercase mb-4">Newsletter</h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Subscribe to our premium club to receive exclusive promotions, weekend getaway discounts, and announcements of new luxury vehicle additions.
          </p>
          {subscribed ? (
            <div className="bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 p-3 rounded-xl text-sm text-center">
              ✓ Subscribed successfully! Thank you.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-semibold text-sm py-2.5 rounded-xl hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/10"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
          <p>© 2026 Vehicle Rental Platform. All rights reserved. Built for Zoomcar-inspired Premium Journey.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Refund Guidelines</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
