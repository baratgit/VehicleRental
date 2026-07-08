import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, Star, Compass, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get("/api/vehicles/");
        // Get popular or top 3 vehicles
        setFeatured(response.data.slice(0, 3));
      } catch (err) {
        console.error("Error fetching vehicles for Home", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    let queryParams = [];
    if (searchQuery) queryParams.push(`search=${encodeURIComponent(searchQuery)}`);
    if (selectedType !== "all") queryParams.push(`type=${selectedType}`);
    if (selectedBrand !== "all") queryParams.push(`brand=${selectedBrand}`);
    
    navigate(`/vehicles?${queryParams.join("&")}`);
  };

  const faqItems = [
    {
      q: "What documents are required to rent a vehicle?",
      a: "You need a valid Government ID and a clean physical driving license. For luxury or sports categories, we might verify your license status during pickup."
    },
    {
      q: "Is there a security deposit required?",
      a: "Yes, a minor security deposit is pre-authorized on your card at the start of your trip. This is fully refunded back immediately upon returning the vehicle in its original state."
    },
    {
      q: "What is your fuel policy?",
      a: "We believe in fair rentals: Fuel up to the same level you received it. For Electric Vehicles, return with at least 15% charge."
    },
    {
      q: "Can I extend my rental duration?",
      a: "Absolutely, you can request trip extensions directly from your customer dashboard. It depends on subsequent slot availability."
    }
  ];

  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen font-sans" id="home-page">
      {/* Hero Section */}
      <section className="relative bg-white py-24 px-4 overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-60"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full text-indigo-600 text-xs font-mono mb-6 uppercase tracking-wider">
            <Sparkles className="h-4 w-4 animate-pulse text-indigo-500" />
            <span>Premium Zoomcar & Drivezy Experience</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
            Premium Vehicles. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">
              Unrestricted Journeys.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-500 text-base sm:text-lg mb-10 leading-relaxed">
            Rent pristine luxury cars, cutting-edge electric models, and classic high-performance cruisers. No hidden costs. Insured fleet. On-demand doorstep delivery.
          </p>

          {/* Search Box Widget */}
          <div className="max-w-4xl mx-auto bg-white border border-slate-200 p-6 rounded-2xl shadow-xl shadow-slate-100/80 backdrop-blur-md" id="home-search-widget">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="text-left">
                <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-widest">Search Name/Brand</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tesla, BMW, Harley..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="text-left">
                <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-widest">Vehicle Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                >
                  <option value="all">All Vehicles</option>
                  <option value="car">Cars Only</option>
                  <option value="bike">Bikes Only</option>
                </select>
              </div>

              <div className="text-left">
                <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-widest">Preferred Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                >
                  <option value="all">Any Brand</option>
                  <option value="Tesla">Tesla</option>
                  <option value="BMW">BMW</option>
                  <option value="Porsche">Porsche</option>
                  <option value="Harley Davidson">Harley Davidson</option>
                  <option value="Royal Enfield">Royal Enfield</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md shadow-indigo-600/10"
                >
                  <Compass className="h-4 w-4" />
                  <span>Find Rentals</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Categories / Showcase Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 uppercase mb-4">Elite Categories</h2>
          <p className="text-slate-500 max-w-md mx-auto text-sm">We provide pre-vetted fleets sorted specifically for your premium aesthetic tastes.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6" id="home-categories-grid">
          {[
            { name: "Luxury Cars", path: "/vehicles?category=Luxury", count: "Porsche & Mercedes", icon: "💎", desc: "Arrive in pure style" },
            { name: "Sports Cars", path: "/vehicles?category=Sports", count: "BMW Competitions", icon: "⚡", desc: "Track-bred acceleration" },
            { name: "Electric Vehicles", path: "/vehicles?category=Electric", count: "Tesla & Ioniq", icon: "🔋", desc: "Zero emissions, instant torque" },
            { name: "Cruiser Bikes", path: "/vehicles?type=bike", count: "Harleys & Royals", icon: "🏍️", desc: "Feel the wild elements" },
          ].map((cat, idx) => (
            <Link
              to={cat.path}
              key={idx}
              className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-indigo-500/50 hover:shadow-lg transition-all group"
            >
              <span className="text-3xl mb-4 block">{cat.icon}</span>
              <h3 className="text-slate-900 font-bold text-lg mb-1 group-hover:text-indigo-600 transition-colors">{cat.name}</h3>
              <p className="text-xs text-indigo-600 font-mono mb-2">{cat.count}</p>
              <p className="text-xs text-slate-400">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="bg-slate-100/50 border-y border-slate-200 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <span className="text-xs font-mono text-indigo-600 uppercase tracking-widest block mb-2">Most Liked Fleet</span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Popular Featured Rentals</h2>
            </div>
            <Link to="/vehicles" className="text-indigo-600 hover:text-indigo-500 text-sm font-semibold flex items-center mt-4 md:mt-0">
              <span>View Full Fleet</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="bg-white border border-slate-200 rounded-2xl h-96 animate-pulse p-4">
                  <div className="bg-slate-100 h-48 rounded-xl mb-4"></div>
                  <div className="h-6 bg-slate-100 rounded mb-2"></div>
                  <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="featured-vehicles-grid">
              {featured.map((v) => (
                <div key={v.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all flex flex-col h-full group">
                  <div className="relative overflow-hidden h-48 bg-slate-100">
                    <img
                      src={v.images[0]}
                      alt={v.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm">
                      {v.category}
                    </span>
                    <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md border border-slate-100 text-slate-900 font-mono text-xs font-bold px-3 py-1 rounded-lg">
                      ${v.pricePerDay}/day
                    </span>
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-indigo-600 font-mono tracking-wider uppercase">{v.brand}</span>
                        <div className="flex items-center text-xs text-amber-500">
                          <Star className="h-3 w-3 fill-current mr-1 text-amber-400" />
                          <span className="font-semibold text-slate-700">{v.ratings}</span>
                        </div>
                      </div>
                      <h3 className="text-slate-800 font-bold text-lg mb-2 truncate group-hover:text-indigo-600 transition-colors">
                        {v.name}
                      </h3>
                      <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-4">
                        {v.description}
                      </p>
                    </div>

                    <div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 font-mono mb-6 border-t border-slate-100 pt-4">
                        <div>Seats: <span className="text-slate-700 font-sans font-medium">{v.seats} Pax</span></div>
                        <div className="truncate">Trans: <span className="text-slate-700 font-sans font-medium">{v.transmission}</span></div>
                        <div className="col-span-2 truncate">Mileage: <span className="text-slate-700 font-sans font-medium">{v.mileage}</span></div>
                      </div>

                      <Link
                        to={`/vehicles/${v.id}`}
                        className="w-full bg-slate-50 text-slate-800 text-center hover:bg-indigo-600 hover:text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-all flex items-center justify-center space-x-1 border border-slate-100"
                      >
                        <span>Check Availability</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-indigo-600 uppercase tracking-widest block mb-2">Trusted Club</span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 uppercase">Loved by Roadtrippers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Kabir Roy",
              role: "Tech Entrepreneur",
              quote: "The Tesla Model S Plaid was deliverd directly to my resort in perfect condition. Unbelievable acceleration and premium service. Highly recommended!",
              stars: 5
            },
            {
              name: "Sophia Martinez",
              role: "Travel Vlogger",
              quote: "I rented the Harley Davidson for a weekend coastal cruise. Extremely simple booking process and fair fuel policy. Will definitely rent again next month.",
              stars: 5
            },
            {
              name: "Akshay Sharma",
              role: "Design Lead",
              quote: "Easiest high-performance rental ever. Customer service is super friendly and the vehicles are spotless. Invoice was generated in one click.",
              stars: 5
            }
          ].map((t, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-8 rounded-2xl relative shadow-sm hover:shadow-md transition-shadow">
              <div className="flex text-amber-400 mb-4">
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
              <div>
                <h4 className="text-slate-900 font-bold text-sm">{t.name}</h4>
                <p className="text-xs text-slate-400">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 uppercase mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-500 text-sm">Everything you need to know about our vehicle rental process.</p>
          </div>

          <div className="space-y-4" id="faq-accordions">
            {faqItems.map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between text-slate-800 font-semibold focus:outline-none cursor-pointer"
                >
                  <span>{item.q}</span>
                  <span className="text-indigo-600 text-xl font-bold">{activeFaq === idx ? "−" : "+"}</span>
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-5 text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
