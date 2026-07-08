import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth, api } from "../context/AuthContext";
import { Star, ShieldCheck, ChevronRight, Calendar, AlertCircle, Info, MessageSquarePlus, User } from "lucide-react";

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [vehicle, setVehicle] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Booking Form State
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState(null);
  
  // Write Review State
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      setLoading(true);
      try {
        const [vehRes, revRes] = await Promise.all([
          axios.get(`/api/vehicles/`),
          axios.get(`/api/reviews/?vehicleId=${id}`)
        ]);
        
        const found = vehRes.data.find((v) => v.id === id);
        if (!found) {
          setError("Vehicle not found.");
        } else {
          setVehicle(found);
          setReviews(revRes.data);
        }
      } catch (err) {
        console.error("Error fetching vehicle details", err);
        setError("Could not load details. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchVehicleDetails();
  }, [id]);

  const handleCheckAvailability = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return;
    
    setCheckingAvailability(true);
    setAvailabilityResult(null);
    
    try {
      const response = await axios.post("/api/check-availability/", {
        vehicleId: id,
        startDate,
        endDate
      });
      setAvailabilityResult(response.data);
    } catch (err) {
      console.error(err);
      setAvailabilityResult({
        available: false,
        message: err.response?.data?.message || "Failed to check availability."
      });
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleCreateBooking = async () => {
    if (!user) {
      navigate("/login?redirect=" + encodeURIComponent(window.location.pathname));
      return;
    }
    
    try {
      const res = await api.post("/api/bookings/", {
        vehicleId: id,
        startDate,
        endDate
      });
      // Redirect to the booking payment checkout screen
      navigate(`/booking/${res.data.id}/payment`);
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed.");
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to write a review.");
      return;
    }
    if (!newComment.trim()) return;

    setReviewSubmitting(true);
    setReviewError("");
    try {
      const res = await api.post("/api/reviews/", {
        vehicleId: id,
        rating: newRating,
        comment: newComment
      });
      setReviews([res.data, ...reviews]);
      setNewComment("");
      setNewRating(5);
      
      // Update local vehicle ratings
      if (vehicle) {
        const newTotalReviews = reviews.length + 1;
        const newAvg = parseFloat(((reviews.reduce((sum, r) => sum + r.rating, 0) + newRating) / newTotalReviews).toFixed(1));
        setVehicle({ ...vehicle, ratings: newAvg });
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to add review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Calculate booking summary breakdown
  const calculateTotal = () => {
    if (!startDate || !endDate || !vehicle) return { days: 0, amount: 0, tax: 0, total: 0 };
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const amount = vehicle.pricePerDay * days;
    const tax = parseFloat((amount * 0.18).toFixed(2));
    const total = parseFloat((amount + tax).toFixed(2));
    return { days, amount, tax, total };
  };

  const bookingBreakdown = calculateTotal();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-slate-50 text-center py-20 px-4">
        <div className="max-w-md mx-auto bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
          <AlertCircle className="h-10 w-10 text-rose-500 mx-auto mb-4" />
          <h2 className="text-slate-900 text-xl font-bold mb-2">Error Occurred</h2>
          <p className="text-slate-500 mb-6">{error || "Vehicle information could not be retrieved."}</p>
          <Link to="/vehicles" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-500 transition-colors">
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans" id="vehicle-details-page">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono uppercase mb-8">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/vehicles" className="hover:text-indigo-600">Vehicles</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-600 truncate">{vehicle.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Vehicle Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Image Gallery */}
            <div className="bg-white border border-slate-200 p-2 rounded-2xl overflow-hidden shadow-sm">
              <img
                src={vehicle.images[0]}
                alt={vehicle.name}
                referrerPolicy="no-referrer"
                className="w-full h-[350px] sm:h-[450px] object-cover rounded-xl"
                id="vehicle-main-image"
              />
            </div>

            {/* Title & Brand */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-mono uppercase px-3 py-1 rounded-lg">
                  {vehicle.category} • {vehicle.type}
                </span>
                <div className="flex items-center text-amber-500 font-mono text-sm">
                  <Star className="h-4 w-4 fill-current mr-1 text-amber-400" />
                  <span className="text-slate-700 font-semibold">{vehicle.ratings} / 5.0 Rating</span>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight" id="vehicle-title-header">
                {vehicle.name}
              </h1>
              <p className="text-slate-500 font-mono text-sm mt-1">Brand: <span className="text-indigo-600 font-semibold">{vehicle.brand}</span></p>
            </div>

            {/* Specifications Cards */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-slate-900 font-bold text-sm tracking-widest uppercase border-b border-slate-100 pb-2">Technical Specifications</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm font-sans" id="specs-grid">
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                  <p className="text-xs text-slate-400 font-mono mb-1">Fuel Type</p>
                  <p className="text-slate-800 font-semibold">{vehicle.fuelType}</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                  <p className="text-xs text-slate-400 font-mono mb-1">Transmission</p>
                  <p className="text-slate-800 font-semibold">{vehicle.transmission}</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                  <p className="text-xs text-slate-400 font-mono mb-1">Capacity</p>
                  <p className="text-slate-800 font-semibold">{vehicle.seats} Seats</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                  <p className="text-xs text-slate-400 font-mono mb-1">Mileage / Range</p>
                  <p className="text-slate-800 font-semibold truncate" title={vehicle.mileage}>{vehicle.mileage}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-slate-900 font-bold text-sm tracking-widest uppercase">Overview & Experience</h3>
              <p className="text-slate-600 text-sm leading-relaxed" id="vehicle-description">
                {vehicle.description}
              </p>
            </div>

            {/* Features list */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-3">
              <h3 className="text-slate-900 font-bold text-sm tracking-widest uppercase border-b border-slate-100 pb-2">Premium Conveniences Included</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600 font-sans" id="features-list">
                {vehicle.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <span className="text-indigo-600 text-lg font-bold">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
                <li className="flex items-center space-x-2">
                  <span className="text-indigo-600 text-lg font-bold">✓</span>
                  <span>Unlimited Roadside Assistance</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-indigo-600 text-lg font-bold">✓</span>
                  <span>Full Tank of Fuel / Full Charge</span>
                </li>
              </ul>
            </div>

            {/* Reviews Section */}
            <div className="space-y-6">
              <h3 className="text-slate-900 font-bold text-sm tracking-widest uppercase border-b border-slate-200 pb-2">Customer Feedback ({reviews.length})</h3>
              
              {/* Write Review Card */}
              {user ? (
                <form onSubmit={handleAddReview} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
                  <div className="flex items-center space-x-2">
                    <MessageSquarePlus className="h-4 w-4 text-indigo-600" />
                    <h4 className="text-slate-900 font-bold text-sm">Write an Honest Review</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">STARS RATING</label>
                      <select
                        value={newRating}
                        onChange={(e) => setNewRating(Number(e.target.value))}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                        <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                        <option value="3">⭐⭐⭐ (3 Stars)</option>
                        <option value="2">⭐⭐ (2 Stars)</option>
                        <option value="1">⭐ (1 Star)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-mono text-slate-400">COMMENTS</label>
                    <textarea
                      required
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your driving and booking experience..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                    ></textarea>
                  </div>

                  {reviewError && <p className="text-rose-600 text-xs font-mono">{reviewError}</p>}

                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="bg-indigo-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-indigo-500 transition-colors disabled:opacity-50 shadow-md shadow-indigo-600/10 cursor-pointer"
                  >
                    {reviewSubmitting ? "Posting..." : "Submit Review"}
                  </button>
                </form>
              ) : (
                <div className="bg-slate-100 border border-slate-200 p-4 rounded-xl text-center">
                  <p className="text-sm text-slate-500">Please <Link to="/login" className="text-indigo-600 underline font-semibold">login</Link> to share your review or rate this vehicle.</p>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4" id="reviews-list">
                {reviews.length === 0 ? (
                  <p className="text-slate-400 text-sm italic">No reviews yet. Be the first to rent and rate this vehicle!</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="bg-slate-100 p-1.5 rounded-full text-slate-500">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{rev.userName}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{new Date(rev.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Booking Widget */}
          <div className="space-y-6">
            
            {/* Rates Card */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-md space-y-6 relative overflow-hidden" id="booking-widget">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-transparent to-transparent pointer-events-none"></div>
              
              <div className="flex justify-between items-end border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs text-slate-400 font-mono uppercase">Premium Rent</span>
                  <p className="text-3xl font-extrabold text-slate-900">${vehicle.pricePerDay} <span className="text-sm text-slate-400 font-normal">/ day</span></p>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-emerald-50 border border-emerald-100 text-emerald-600 font-semibold px-2.5 py-1 rounded-lg">
                    Active Fleet
                  </span>
                </div>
              </div>

              {/* Check Availability Box */}
              <form onSubmit={handleCheckAvailability} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">START DATE</label>
                    <input
                      type="date"
                      required
                      min={todayStr}
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setAvailabilityResult(null);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">END DATE</label>
                    <input
                      type="date"
                      required
                      min={startDate || todayStr}
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setAvailabilityResult(null);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!startDate || !endDate || checkingAvailability}
                  className="w-full bg-slate-100 hover:bg-slate-250 text-slate-800 font-semibold text-sm py-2.5 rounded-xl transition-colors flex items-center justify-center space-x-1 cursor-pointer disabled:opacity-40 border border-slate-200/50"
                >
                  <Calendar className="h-4 w-4 text-indigo-600" />
                  <span>{checkingAvailability ? "Checking slots..." : "Verify Booking Dates"}</span>
                </button>
              </form>

              {/* Availability Output & Cost breakdown */}
              {availabilityResult && (
                <div className="space-y-4 animate-fadeIn">
                  {availabilityResult.available ? (
                    <div className="bg-emerald-50/50 border border-emerald-200 p-4 rounded-xl space-y-4">
                      <div className="flex items-center space-x-2 text-emerald-700 text-xs font-semibold">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Dates Available to Rent!</span>
                      </div>
                      
                      {/* Booking Cost Summary Breakdown */}
                      <div className="space-y-2 border-t border-emerald-100 pt-3 text-xs text-slate-500 font-sans">
                        <div className="flex justify-between">
                          <span>Rental ({bookingBreakdown.days} days):</span>
                          <span className="text-slate-800 font-medium">${bookingBreakdown.amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Insurance & Service Tax (18%):</span>
                          <span className="text-slate-800 font-medium">${bookingBreakdown.tax}</span>
                        </div>
                        <div className="flex justify-between font-bold text-slate-900 text-sm border-t border-emerald-100 pt-2">
                          <span>Grand Total (INR Equivalent):</span>
                          <span className="text-indigo-600 font-extrabold">${bookingBreakdown.total}</span>
                        </div>
                      </div>

                      <button
                        onClick={handleCreateBooking}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-3 rounded-xl transition-all flex items-center justify-center space-x-1 cursor-pointer shadow-lg shadow-indigo-600/15"
                        id="book-now-button"
                      >
                        <span>Instantly Book & Pay</span>
                      </button>
                    </div>
                  ) : (
                    <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 text-rose-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-rose-700 text-xs font-semibold">Vehicle Reserved</p>
                        <p className="text-xs text-rose-600/80 mt-1">{availabilityResult.message}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Basic Guidelines */}
              <div className="border-t border-slate-100 pt-4 space-y-2 text-[11px] text-slate-400 font-sans leading-relaxed">
                <p className="flex items-center space-x-1.5">
                  <ShieldCheck className="h-3 w-3 text-indigo-600" />
                  <span>Free Roadside Assistance and Full Damage Waiver.</span>
                </p>
                <p className="flex items-center space-x-1.5">
                  <Info className="h-3 w-3 text-indigo-600" />
                  <span>License verification and simple checklist during pickup.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
