import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth, api } from "../context/AuthContext";
import { User, Calendar, CreditCard, Star, Key, FileSpreadsheet, Trash2, MessageCircle } from "lucide-react";
import InvoiceModal from "../components/InvoiceModal";

export default function UserDashboard() {
  const { user, updateProfile, changePassword } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "profile");

  // Selected Booking and Payment for Invoice Modal
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  // Profile Form States
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [address, setAddress] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Change Password States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError, setPwError] = useState("");

  // Data states
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Sync profile details
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setPhone(user.phone);
      setLicenseNumber(user.licenseNumber);
      setAddress(user.address);
    }
  }, [user]);

  // Fetch collections
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoadingData(true);
      try {
        const [bkRes, payRes, revRes] = await Promise.all([
          api.get("/api/bookings/"),
          api.get("/api/payment/history/"),
          api.get("/api/reviews/")
        ]);
        
        setBookings(bkRes.data);
        setPayments(payRes.data);
        // Filter reviews created by this user
        setReviews(revRes.data.filter((r) => r.userId === user.id));
      } catch (err) {
        console.error("Error loading customer collections", err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [user, activeTab]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSuccess("");
    setProfileError("");
    try {
      await updateProfile({ username, email, phone, licenseNumber, address });
      setProfileSuccess("Your profile details have been successfully saved!");
    } catch (err) {
      setProfileError(err.message || "Failed to update profile.");
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwSuccess("");
    setPwError("");

    if (newPassword !== confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }

    try {
      await changePassword({ current_password: currentPassword, new_password: newPassword });
      setPwSuccess("Password successfully changed!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPwError(err.message || "Incorrect current password.");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you absolutely sure you want to cancel this reservation? This cannot be undone.")) return;
    try {
      await api.put(`/api/bookings/${bookingId}`, { status: "Cancelled" });
      // Update local state
      setBookings(bookings.map((b) => (b.id === bookingId ? { ...b, status: "Cancelled" } : b)));
      alert("Reservation cancelled successfully.");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.delete(`/api/reviews/${reviewId}`);
      setReviews(reviews.filter((r) => r.id !== reviewId));
      alert("Review deleted.");
    } catch (err) {
      alert("Failed to delete review.");
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans" id="user-dashboard-page">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-8 uppercase">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Navigation Tab sidebar */}
          <aside className="bg-white border border-slate-200 p-3 sm:p-4 rounded-2xl h-fit flex lg:flex-col overflow-x-auto lg:overflow-visible gap-1.5 lg:gap-1 lg:space-y-1 shadow-sm scrollbar-none snap-x">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex lg:w-full items-center space-x-2 lg:space-x-3 px-3.5 py-2 lg:px-4 lg:py-3 rounded-xl text-xs lg:text-sm font-semibold transition-colors text-left cursor-pointer snap-center shrink-0 ${
                activeTab === "profile" 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 bg-slate-50 lg:bg-transparent border border-slate-100 lg:border-0"
              }`}
            >
              <User className="h-4 w-4 shrink-0" />
              <span>Profile Settings</span>
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`flex lg:w-full items-center space-x-2 lg:space-x-3 px-3.5 py-2 lg:px-4 lg:py-3 rounded-xl text-xs lg:text-sm font-semibold transition-colors text-left cursor-pointer snap-center shrink-0 ${
                activeTab === "bookings" 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 bg-slate-50 lg:bg-transparent border border-slate-100 lg:border-0"
              }`}
            >
              <Calendar className="h-4 w-4 shrink-0" />
              <span>Reservations ({bookings.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`flex lg:w-full items-center space-x-2 lg:space-x-3 px-3.5 py-2 lg:px-4 lg:py-3 rounded-xl text-xs lg:text-sm font-semibold transition-colors text-left cursor-pointer snap-center shrink-0 ${
                activeTab === "payments" 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 bg-slate-50 lg:bg-transparent border border-slate-100 lg:border-0"
              }`}
            >
              <CreditCard className="h-4 w-4 shrink-0" />
              <span>Payments ({payments.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex lg:w-full items-center space-x-2 lg:space-x-3 px-3.5 py-2 lg:px-4 lg:py-3 rounded-xl text-xs lg:text-sm font-semibold transition-colors text-left cursor-pointer snap-center shrink-0 ${
                activeTab === "reviews" 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 bg-slate-50 lg:bg-transparent border border-slate-100 lg:border-0"
              }`}
            >
              <MessageCircle className="h-4 w-4 shrink-0" />
              <span>Reviews ({reviews.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex lg:w-full items-center space-x-2 lg:space-x-3 px-3.5 py-2 lg:px-4 lg:py-3 rounded-xl text-xs lg:text-sm font-semibold transition-colors text-left cursor-pointer snap-center shrink-0 ${
                activeTab === "password" 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 bg-slate-50 lg:bg-transparent border border-slate-100 lg:border-0"
              }`}
            >
              <Key className="h-4 w-4 shrink-0" />
              <span>Password</span>
            </button>
          </aside>

          {/* Core Panel contents */}
          <main className="lg:col-span-3">
            
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="bg-white border border-slate-200 p-8 rounded-2xl space-y-6 shadow-sm animate-fadeIn" id="tab-profile-content">
                <div>
                  <h2 className="text-slate-900 font-extrabold text-lg">Contact Information</h2>
                  <p className="text-slate-500 text-xs">Keep your personal contact and driving license credentials updated for immediate car handovers.</p>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">USERNAME</label>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">EMAIL ADDRESS</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">PHONE NUMBER</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">DRIVING LICENSE NUMBER</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. DL-142011002345"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">RESIDENTIAL ADDRESS</label>
                    <textarea
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter full permanent postal address..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                    ></textarea>
                  </div>

                  {profileSuccess && <p className="text-emerald-600 text-xs font-mono">{profileSuccess}</p>}
                  {profileError && <p className="text-rose-600 text-xs font-mono">{profileError}</p>}

                  <button
                    type="submit"
                    className="bg-indigo-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/10 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {/* RESERVATIONS TAB */}
            {activeTab === "bookings" && (
              <div className="space-y-6 animate-fadeIn" id="tab-bookings-content">
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                  <h2 className="text-slate-900 font-extrabold text-lg">My Historical Reservations</h2>
                  <p className="text-slate-500 text-xs">Verify dates, trip statuses, print invoice files, or cancel reservations safely.</p>
                </div>

                {loadingData ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2].map((s) => (
                      <div key={s} className="bg-slate-200 h-32 rounded-2xl shadow-sm"></div>
                    ))}
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="bg-white border border-slate-200 p-12 text-center rounded-2xl shadow-sm">
                    <Calendar className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">You do not have any bookings yet.</p>
                    <Link to="/vehicles" className="mt-4 inline-block bg-indigo-600 text-white font-semibold px-4 py-2.5 rounded-xl text-xs hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/10">
                      Rent a Vehicle
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((bk) => (
                      <div key={bk.id} className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
                        <div className="flex space-x-4 items-center">
                          <img
                            src={bk.vehicleImage}
                            alt={bk.vehicleName}
                            referrerPolicy="no-referrer"
                            className="w-20 h-14 object-cover rounded-lg border border-slate-100 bg-slate-50"
                          />
                          <div>
                            <h3 className="text-slate-900 font-extrabold text-sm">{bk.vehicleName}</h3>
                            <p className="text-[10px] text-slate-400 font-mono">RESERVATION ID: {bk.id}</p>
                            <span className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              bk.status === "Confirmed" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                              bk.status === "Completed" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                              bk.status === "Pending" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                              "bg-slate-100 text-slate-500 border border-slate-200"
                            }`}>
                              {bk.status}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs font-mono sm:border-l sm:border-slate-100 sm:pl-6">
                          <div>
                            <span className="text-slate-400 block">START</span>
                            <span className="text-slate-700">{bk.startDate}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">END</span>
                            <span className="text-slate-700">{bk.endDate}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">PRICE</span>
                            <span className="text-indigo-600 font-bold">${bk.totalAmount}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">DAYS</span>
                            <span className="text-slate-700">{bk.totalDays} Days</span>
                          </div>
                        </div>

                        <div className="flex flex-row sm:flex-col justify-end gap-2 border-t border-slate-100 pt-4 sm:pt-0 sm:border-0">
                          {bk.status === "Pending" && (
                            <Link
                              to={`/booking/${bk.id}/payment`}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white text-center text-xs font-semibold px-4 py-2 rounded-xl transition-colors shadow-md shadow-indigo-600/10"
                            >
                              Pay Now
                            </Link>
                          )}
                          
                          {bk.status === "Confirmed" && (
                            <button
                              onClick={() => {
                                const payment = payments.find((p) => p.bookingId === bk.id);
                                setSelectedBooking(bk);
                                setSelectedPayment(payment);
                                setInvoiceOpen(true);
                              }}
                              className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs px-3 py-2 rounded-xl flex items-center justify-center space-x-1 border border-slate-200 cursor-pointer transition-colors"
                            >
                              <FileSpreadsheet className="h-3.5 w-3.5 text-indigo-600" />
                              <span>Invoice</span>
                            </button>
                          )}

                          {(bk.status === "Pending" || bk.status === "Confirmed") && (
                            <button
                              onClick={() => handleCancelBooking(bk.id)}
                              className="bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white text-xs px-3 py-2 rounded-xl cursor-pointer transition-colors"
                            >
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PAYMENTS TAB */}
            {activeTab === "payments" && (
              <div className="space-y-6 animate-fadeIn" id="tab-payments-content">
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                  <h2 className="text-slate-900 font-extrabold text-lg">My Payment Transactions</h2>
                  <p className="text-slate-500 text-xs">Verify taxes, grand totals, and bank gateway transaction receipts.</p>
                </div>

                {loadingData ? (
                  <div className="animate-pulse space-y-4">
                    <div className="bg-slate-200 h-24 rounded-2xl"></div>
                  </div>
                ) : payments.length === 0 ? (
                  <p className="text-slate-400 text-center py-10 bg-white border border-slate-200 rounded-2xl shadow-sm">No financial transactions registered.</p>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto shadow-sm">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 font-mono text-xs text-slate-500 uppercase">
                          <th className="p-4">TXN ID</th>
                          <th className="p-4">Booking Ref</th>
                          <th className="p-4">Fare Billed</th>
                          <th className="p-4">Tax (GST)</th>
                          <th className="p-4">Total</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {payments.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/50">
                            <td className="p-4 font-mono text-xs text-indigo-600 font-bold">{p.transactionId}</td>
                            <td className="p-4 font-mono text-xs text-slate-500">{p.bookingId}</td>
                            <td className="p-4 text-slate-700">${p.amount}</td>
                            <td className="p-4 text-slate-400">${p.tax}</td>
                            <td className="p-4 font-extrabold text-slate-900">${p.grandTotal}</td>
                            <td className="p-4">
                              <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                p.status === "Success" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                p.status === "Refunded" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                                "bg-rose-50 text-rose-600 border border-rose-100"
                              }`}>
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* MY REVIEWS TAB */}
            {activeTab === "reviews" && (
              <div className="space-y-6 animate-fadeIn" id="tab-reviews-content">
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                  <h2 className="text-slate-900 font-extrabold text-lg">My Shared Reviews</h2>
                  <p className="text-slate-500 text-xs">View or moderate reviews you've posted on rented vehicles.</p>
                </div>

                {loadingData ? (
                  <div className="bg-slate-200 h-20 rounded-2xl animate-pulse"></div>
                ) : reviews.length === 0 ? (
                  <p className="text-slate-400 text-center py-10 bg-white border border-slate-200 rounded-2xl shadow-sm">You haven't posted any reviews yet.</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] text-indigo-600 font-mono uppercase tracking-wider block mb-1">Vehicle Ref: {rev.vehicleId}</span>
                            <p className="text-xs text-slate-400 font-mono">{new Date(rev.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex text-amber-400">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="h-3.5 w-3.5 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm italic">"{rev.comment}"</p>
                        <div className="flex justify-end pt-2 border-t border-slate-100">
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="flex items-center space-x-1 text-xs text-rose-600 hover:text-rose-500 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete Review</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CHANGE PASSWORD TAB */}
            {activeTab === "password" && (
              <div className="bg-white border border-slate-200 p-8 rounded-2xl space-y-6 shadow-sm animate-fadeIn" id="tab-password-content">
                <div>
                  <h2 className="text-slate-900 font-extrabold text-lg">Change Account Password</h2>
                  <p className="text-slate-500 text-xs">Verify your old account credentials and enter a secure subsequent password.</p>
                </div>

                <form onSubmit={handleChangePasswordSubmit} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">CURRENT PASSWORD</label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">NEW PASSWORD</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">CONFIRM NEW PASSWORD</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                    />
                  </div>

                  {pwSuccess && <p className="text-emerald-600 text-xs font-mono">{pwSuccess}</p>}
                  {pwError && <p className="text-rose-600 text-xs font-mono">{pwError}</p>}

                  <button
                    type="submit"
                    className="bg-indigo-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/10 cursor-pointer"
                  >
                    Change Password
                  </button>
                </form>
              </div>
            )}

          </main>
        </div>
      </div>

      <InvoiceModal
        isOpen={invoiceOpen}
        onClose={() => {
          setInvoiceOpen(false);
          setSelectedBooking(null);
          setSelectedPayment(null);
        }}
        booking={selectedBooking}
        payment={selectedPayment}
      />
    </div>
  );
}
