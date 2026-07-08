import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { Search, Grid, List, SlidersHorizontal, Star, Trash2, ArrowUpDown, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";

export default function Vehicles() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");

  // Filters State
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [brand, setBrand] = useState(searchParams.get("brand") || "all");
  const [type, setType] = useState(searchParams.get("type") || "all");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [fuelType, setFuelType] = useState("all");
  const [transmission, setTransmission] = useState("all");
  const [seats, setSeats] = useState("all");
  const [priceRange, setPriceRange] = useState(300);
  const [sortBy, setSortBy] = useState("newest");
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/vehicles/");
        setVehicles(response.data);
      } catch (err) {
        console.error("Error fetching vehicles", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  // Update initial filter states if search parameters change
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setBrand(searchParams.get("brand") || "all");
    setType(searchParams.get("type") || "all");
    setCategory(searchParams.get("category") || "all");
  }, [searchParams]);

  const clearFilters = () => {
    setSearch("");
    setBrand("all");
    setType("all");
    setCategory("all");
    setFuelType("all");
    setTransmission("all");
    setSeats("all");
    setPriceRange(300);
    setSortBy("newest");
    setSearchParams({});
    setCurrentPage(1);
  };

  // Filtering Logic
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.brand.toLowerCase().includes(search.toLowerCase()) ||
      v.description.toLowerCase().includes(search.toLowerCase());

    const matchesBrand = brand === "all" || v.brand.toLowerCase() === brand.toLowerCase();
    const matchesType = type === "all" || v.type.toLowerCase() === type.toLowerCase();
    const matchesCategory = category === "all" || v.category.toLowerCase() === category.toLowerCase();
    const matchesFuel = fuelType === "all" || v.fuelType.toLowerCase() === fuelType.toLowerCase();
    const matchesTrans = transmission === "all" || v.transmission.toLowerCase() === transmission.toLowerCase();
    const matchesSeats = seats === "all" || v.seats === Number(seats);
    const matchesPrice = v.pricePerDay <= priceRange;

    return (
      matchesSearch &&
      matchesBrand &&
      matchesType &&
      matchesCategory &&
      matchesFuel &&
      matchesTrans &&
      matchesSeats &&
      matchesPrice
    );
  });

  // Sorting Logic
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    if (sortBy === "price_asc") return a.pricePerDay - b.pricePerDay;
    if (sortBy === "price_desc") return b.pricePerDay - a.pricePerDay;
    if (sortBy === "ratings") return b.ratings - a.ratings;
    // Default / newest: we can sort by id desc
    return b.id.localeCompare(a.id);
  });

  // Pagination Logic
  const totalItems = sortedVehicles.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedVehicles.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans" id="vehicles-page">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 uppercase">Browse Rentals</h1>
            <p className="text-slate-500 text-sm mt-1">Explore our pristine fleet of sports cars, luxury sedans, electrics and cruisers.</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            {/* View Grid/List Toggles */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg cursor-pointer ${viewMode === "grid" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-700"}`}
                title="Grid View"
                id="btn-grid-view"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg cursor-pointer ${viewMode === "list" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-700"}`}
                title="List View"
                id="btn-list-view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="md:hidden flex items-center space-x-1 bg-white border border-slate-200 px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-slate-50"
            >
              <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Collapsible / Sidebar Filters (Desktop) */}
          <aside className={`bg-white border border-slate-200 p-6 rounded-2xl h-fit space-y-6 shadow-sm ${showFiltersMobile ? "block" : "hidden md:block"}`} id="filter-sidebar">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-slate-900 font-bold text-sm tracking-widest uppercase flex items-center space-x-2">
                <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
                <span>Filters</span>
              </h2>
              <button
                onClick={clearFilters}
                className="text-xs text-indigo-600 hover:text-indigo-500 flex items-center space-x-1 cursor-pointer"
                id="clear-filters-btn"
              >
                <Trash2 className="h-3 w-3" />
                <span>Reset All</span>
              </button>
            </div>

            {/* Search Input inside sidebar */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">Global Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Keyword search..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Vehicle Type Filter */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">Vehicle Type</label>
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              >
                <option value="all">All Types</option>
                <option value="car">Cars</option>
                <option value="bike">Bikes</option>
              </select>
            </div>

            {/* Brand Filter */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">Brand</label>
              <select
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              >
                <option value="all">Any Brand</option>
                <option value="Tesla">Tesla</option>
                <option value="BMW">BMW</option>
                <option value="Porsche">Porsche</option>
                <option value="Harley Davidson">Harley Davidson</option>
                <option value="Royal Enfield">Royal Enfield</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">Category</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              >
                <option value="all">Any Category</option>
                <option value="luxury">Luxury</option>
                <option value="sports">Sports</option>
                <option value="electric">Electric</option>
                <option value="standard">Standard</option>
              </select>
            </div>

            {/* Fuel Type */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">Fuel Type</label>
              <select
                value={fuelType}
                onChange={(e) => {
                  setFuelType(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              >
                <option value="all">Any Fuel</option>
                <option value="electric">Electric</option>
                <option value="petrol">Petrol</option>
              </select>
            </div>

            {/* Transmission */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">Transmission</label>
              <select
                value={transmission}
                onChange={(e) => {
                  setTransmission(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              >
                <option value="all">Any Transmission</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono text-slate-400 uppercase tracking-widest">
                <span>Price per Day</span>
                <span className="text-indigo-600 font-bold">${priceRange}</span>
              </div>
              <input
                type="range"
                min="30"
                max="300"
                step="10"
                value={priceRange}
                onChange={(e) => {
                  setPriceRange(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
              />
            </div>

            {/* Sorting */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center space-x-1">
                <ArrowUpDown className="h-3 w-3" />
                <span>Sort By</span>
              </label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              >
                <option value="newest">Newest Listed</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="ratings">Ratings</option>
              </select>
            </div>
          </aside>

          {/* Listing Grid / List (Right Side) */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-2xl h-80 animate-pulse p-4">
                    <div className="bg-slate-100 h-40 rounded-xl mb-4"></div>
                    <div className="h-6 bg-slate-100 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : currentItems.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
                <div className="bg-indigo-50 p-4 rounded-full text-indigo-600 inline-block mb-4">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <h3 className="text-slate-900 font-bold text-lg mb-2">No Vehicles Found</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                  We couldn't find any rentals matching your exact filter selections. Try clearing or relaxing some bounds.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-indigo-600 text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/10 cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div>
                {/* Result count */}
                <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-6">
                  <span>Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, totalItems)} of {totalItems} vehicles</span>
                </div>

                {/* Display Lists */}
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="vehicles-grid">
                    {currentItems.map((v) => (
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
                              <span>Rent Now</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6" id="vehicles-list">
                    {currentItems.map((v) => (
                      <div key={v.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all flex flex-col md:flex-row group border border-slate-200">
                        <div className="relative overflow-hidden h-48 md:h-auto md:w-72 flex-shrink-0 bg-slate-100">
                          <img
                            src={v.images[0]}
                            alt={v.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm">
                            {v.category}
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
                            <h3 className="text-slate-800 font-bold text-xl mb-2 group-hover:text-indigo-600 transition-colors">
                              {v.name}
                            </h3>
                            <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-4">
                              {v.description}
                            </p>
                          </div>

                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-slate-100 pt-4">
                            <div className="grid grid-cols-3 gap-x-6 text-xs text-slate-400 font-mono">
                              <div>Seats: <span className="text-slate-700 font-sans font-medium">{v.seats} Pax</span></div>
                              <div>Trans: <span className="text-slate-700 font-sans font-medium">{v.transmission}</span></div>
                              <div>Fuel: <span className="text-slate-700 font-sans font-medium">{v.fuelType}</span></div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-6">
                              <div className="text-right">
                                <p className="text-xs text-slate-400 font-mono">Rent</p>
                                <p className="text-slate-900 font-bold text-lg">${v.pricePerDay}<span className="text-xs text-slate-400">/day</span></p>
                              </div>

                              <Link
                                id={`rent-link-${v.id}`}
                                to={`/vehicles/${v.id}`}
                                className="bg-indigo-600 text-white hover:bg-indigo-500 font-semibold text-sm py-2.5 px-6 rounded-xl transition-all shadow-md shadow-indigo-600/10"
                              >
                                Rent Now
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-12 border-t border-slate-200 pt-6">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => paginate(i + 1)}
                        className={`px-4 py-2 rounded-xl border font-mono text-sm transition-colors cursor-pointer ${
                          currentPage === i + 1
                            ? "bg-indigo-600 border-indigo-600 text-white font-bold"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
