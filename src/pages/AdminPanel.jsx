import React, { useState, useEffect } from "react";
import { useAuth, api } from "../context/AuthContext";
import { 
  Shield, Users, Car, Calendar, DollarSign, BarChart3, Plus, Edit2, 
  Trash2, Search, Star, LogOut
} from "lucide-react";

export default function AdminPanel() {
  const { user: currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Collections State
  const [vehicles, setVehicles] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [payments, setPayments] = useState([]);

  // Report Metrics State
  const [reportBookings, setReportBookings] = useState(null);
  const [reportRevenue, setReportRevenue] = useState(null);
  const [reportUsers, setReportUsers] = useState(null);
  const [reportVehicles, setReportVehicles] = useState(null);
  const [reportReviews, setReportReviews] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState(null);

  // Loading / UI states
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editVehicleId, setEditVehicleId] = useState(null);

  // Custom Toast Notification State
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Custom Confirm Dialog State
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null
  });

  const requestConfirm = (title, message, onConfirm) => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmState({ isOpen: false, title: "", message: "", onConfirm: null });
      }
    });
  };

  // Search/Filter states
  const [searchVehicles, setSearchVehicles] = useState("");
  const [searchUsers, setSearchUsers] = useState("");
  const [searchBookings, setSearchBookings] = useState("");
  const [filterBookingStatus, setFilterBookingStatus] = useState("all");
  const [searchPayments, setSearchPayments] = useState("");

  // CRUD Vehicle Form State
  const [vehName, setVehName] = useState("");
  const [vehBrand, setVehBrand] = useState("");
  const [vehType, setVehType] = useState("car");
  const [vehCategory, setVehCategory] = useState("Standard");
  const [vehFuel, setVehFuel] = useState("Petrol");
  const [vehTrans, setVehTrans] = useState("Automatic");
  const [vehPrice, setVehPrice] = useState("");
  const [vehSeats, setVehSeats] = useState("");
  const [vehMileage, setVehMileage] = useState("");
  const [vehDesc, setVehDesc] = useState("");
  const [vehFeatures, setVehFeatures] = useState("");
  const [vehImage, setVehImage] = useState("");

  const refreshAllData = async () => {
    setLoading(true);
    try {
      const [
        vehRes, usrRes, bkRes, revRes, payRes,
        repBk, repRev, repUsr, repVeh, repRevCount, repMonth
      ] = await Promise.all([
        api.get("/api/vehicles/"),
        api.get("/api/admin/users/"),
        api.get("/api/bookings/"),
        api.get("/api/reviews/"),
        api.get("/api/payment/history/"),
        api.get("/api/reports/bookings/"),
        api.get("/api/reports/revenue/"),
        api.get("/api/reports/users/"),
        api.get("/api/reports/vehicles/"),
        api.get("/api/reports/reviews/"),
        api.get("/api/reports/monthly-revenue/")
      ]);

      setVehicles(vehRes.data);
      setUsersList(usrRes.data);
      setBookings(bkRes.data);
      setReviews(revRes.data);
      setPayments(payRes.data);

      setReportBookings(repBk.data);
      setReportRevenue(repRev.data);
      setReportUsers(repUsr.data);
      setReportVehicles(repVeh.data);
      setReportReviews(repRevCount.data);
      setMonthlyStats(repMonth.data);

    } catch (err) {
      console.error("Error loading administrative console datasets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, [activeTab]);

  // Open Add Vehicle Modal
  const handleOpenAddModal = () => {
    setEditVehicleId(null);
    setVehName("");
    setVehBrand("");
    setVehType("car");
    setVehCategory("Standard");
    setVehFuel("Petrol");
    setVehTrans("Automatic");
    setVehPrice("");
    setVehSeats("4");
    setVehMileage("20 mpg");
    setVehDesc("");
    setVehFeatures("Premium Audio, GPS Navigation, Bluetooth, Backup Camera");
    setVehImage("");
    setModalOpen(true);
  };

  // Open Edit Vehicle Modal
  const handleOpenEditModal = (v) => {
    setEditVehicleId(v.id);
    setVehName(v.name || "");
    setVehBrand(v.brand || "");
    setVehType(v.type || "car");
    setVehCategory(v.category || "Standard");
    setVehFuel(v.fuelType || "Petrol");
    setVehTrans(v.transmission || "Automatic");
    setVehPrice(v.pricePerDay !== undefined ? String(v.pricePerDay) : "");
    setVehSeats(v.seats !== undefined ? String(v.seats) : "");
    setVehMileage(v.mileage || "");
    setVehDesc(v.description || "");
    setVehFeatures(v.features && Array.isArray(v.features) ? v.features.join(", ") : "");
    setVehImage(v.images && v.images[0] ? v.images[0] : "");
    setModalOpen(true);
  };

  // Create or Update Vehicle handler
  const handleSaveVehicle = async (e) => {
    e.preventDefault();
    const payload = {
      name: vehName,
      brand: vehBrand,
      type: vehType,
      category: vehCategory,
      fuelType: vehFuel,
      transmission: vehTrans,
      pricePerDay: Number(vehPrice),
      seats: Number(vehSeats),
      mileage: vehMileage,
      description: vehDesc,
      features: vehFeatures.split(",").map(f => f.trim()).filter(Boolean),
      images: vehImage ? [vehImage] : [],
    };

    try {
      if (editVehicleId) {
        await api.put(`/api/vehicles/${editVehicleId}`, payload);
        showToast("Vehicle updated successfully!", "success");
      } else {
        await api.post("/api/vehicles/", payload);
        showToast("New vehicle listed successfully!", "success");
      }
      setModalOpen(false);
      refreshAllData();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to save vehicle details.", "error");
    }
  };

  // Delete Vehicle
  const handleDeleteVehicle = (vehId) => {
    requestConfirm(
      "Confirm Delete",
      "Are you sure you want to permanently delete this vehicle from the listing?",
      async () => {
        try {
          await api.delete(`/api/vehicles/${vehId}`);
          showToast("Vehicle deleted.", "success");
          refreshAllData();
        } catch (err) {
          showToast("Failed to delete vehicle.", "error");
        }
      }
    );
  };

  // Suspense/Activate User
  const handleToggleSuspendUser = async (u) => {
    try {
      await api.put(`/api/admin/users/${u.id}`, { isSuspended: !u.isSuspended });
      showToast("User status changed successfully.", "success");
      refreshAllData();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to change user status.", "error");
    }
  };

  // Change User Role
  const handleToggleUserRole = async (u) => {
    const targetRole = u.role === "admin" ? "customer" : "admin";
    try {
      await api.put(`/api/admin/users/${u.id}`, { role: targetRole });
      showToast(`User role updated to ${targetRole}.`, "success");
      refreshAllData();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to change user role.", "error");
    }
  };

  // Delete User
  const handleDeleteUser = (usrId) => {
    requestConfirm(
      "Confirm User Deletion",
      "Are you sure you want to delete this user?",
      async () => {
        try {
          await api.delete(`/api/admin/users/${usrId}`);
          showToast("User deleted.", "success");
          refreshAllData();
        } catch (err) {
          showToast(err.response?.data?.message || "Failed to delete user.", "error");
        }
      }
    );
  };

  // Confirm / Complete / Cancel Booking from admin console
  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await api.put(`/api/bookings/${bookingId}`, { status });
      showToast(`Booking status changed to ${status}.`, "success");
      refreshAllData();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update status.", "error");
    }
  };

  // Refund Payment
  const handleRefundPayment = (pId) => {
    requestConfirm(
      "Confirm Refund",
      "Are you sure you want to trigger a full refund for this payment?",
      async () => {
        try {
          await api.post(`/api/payment/refund/${pId}`);
          showToast("Payment fully refunded and associated booking cancelled.", "success");
          refreshAllData();
        } catch (err) {
          showToast("Failed to refund payment.", "error");
        }
      }
    );
  };

  // Delete Review
  const handleDeleteReview = (revId) => {
    requestConfirm(
      "Confirm Moderation",
      "Are you sure you want to moderate and delete this review?",
      async () => {
        try {
          await api.delete(`/api/reviews/${revId}`);
          showToast("Review moderated and deleted.", "success");
          refreshAllData();
        } catch (err) {
          showToast("Failed to moderate review.", "error");
        }
      }
    );
  };

  // Filter lists
  const filteredVehs = vehicles.filter(v => 
    v.name.toLowerCase().includes(searchVehicles.toLowerCase()) || 
    v.brand.toLowerCase().includes(searchVehicles.toLowerCase())
  );

  const filteredUsrs = usersList.filter(u => 
    u.username.toLowerCase().includes(searchUsers.toLowerCase()) || 
    u.email.toLowerCase().includes(searchUsers.toLowerCase()) ||
    u.phone.includes(searchUsers)
  );

  const filteredBks = bookings.filter(b => {
    const matchesSearch = b.vehicleName.toLowerCase().includes(searchBookings.toLowerCase()) ||
      b.userName.toLowerCase().includes(searchBookings.toLowerCase()) ||
      b.id.includes(searchBookings);
    
    const matchesStatus = filterBookingStatus === "all" || b.status === filterBookingStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredPays = payments.filter(p => 
    p.transactionId.toLowerCase().includes(searchPayments.toLowerCase()) ||
    p.userEmail.toLowerCase().includes(searchPayments.toLowerCase())
  );

  if (loading && !reportBookings) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen font-sans flex flex-col md:flex-row" id="admin-panel">
      
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 p-4 md:py-8 flex flex-col md:justify-between flex-shrink-0 md:sticky md:top-16 md:h-[calc(100vh-64px)] z-40">
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center justify-between md:block px-1 md:px-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-indigo-600" />
              <span className="font-extrabold text-sm tracking-wider uppercase text-slate-900">Console Admin</span>
            </div>
            {/* Quick exit console for mobile */}
            <button
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
              className="md:hidden flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Exit</span>
            </button>
          </div>
 
          <nav className="flex md:flex-col overflow-x-auto md:overflow-visible gap-1.5 md:gap-1 pb-1 md:pb-0 scrollbar-none snap-x">
            {[
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              { id: "vehicles", label: "Vehicles", icon: Car },
              { id: "users", label: "Users", icon: Users },
              { id: "bookings", label: "Reservations", icon: Calendar },
              { id: "payments", label: "Transactions", icon: DollarSign },
              { id: "reviews", label: "Reviews", icon: Star },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 md:space-x-3 px-3 py-2 md:px-4 md:py-3 rounded-xl text-xs md:text-sm font-semibold transition-all text-left cursor-pointer snap-center shrink-0 ${
                  activeTab === tab.id 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 bg-slate-50 md:bg-transparent border border-slate-100 md:border-0"
                }`}
              >
                <tab.icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
 
        <button
          onClick={() => {
            logout();
            window.location.href = "/login";
          }}
          className="hidden md:flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50/50 hover:text-rose-700 transition-colors text-left cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Exit Console</span>
        </button>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-grow p-4 sm:p-8 overflow-y-auto">
        
        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fadeIn" id="admin-dash-tab">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">System Analytics Overview</h1>
              <p className="text-slate-500 text-xs mt-1">Real-time reports, monthly financial graphs, and fleet distributions.</p>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center text-slate-400 mb-2">
                  <span className="text-xs font-mono uppercase">Gross Revenue</span>
                  <DollarSign className="h-4 w-4 text-indigo-600" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900">${reportRevenue?.totalRevenue || 0}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-1">Net: ${reportRevenue?.netRevenue || 0}</p>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center text-slate-400 mb-2">
                  <span className="text-xs font-mono uppercase">Total Fleet</span>
                  <Car className="h-4 w-4 text-indigo-600" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900">{reportVehicles?.total || 0}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-1">Cars: {reportVehicles?.cars} | Bikes: {reportVehicles?.bikes}</p>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center text-slate-400 mb-2">
                  <span className="text-xs font-mono uppercase">User base</span>
                  <Users className="h-4 w-4 text-indigo-600" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900">{reportUsers?.total || 0}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-1">Admins: {reportUsers?.admins} | Custom: {reportUsers?.customers}</p>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center text-slate-400 mb-2">
                  <span className="text-xs font-mono uppercase">Bookings</span>
                  <Calendar className="h-4 w-4 text-indigo-600" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900">{reportBookings?.total || 0}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-1">Conf: {reportBookings?.confirmed} | Pend: {reportBookings?.pending}</p>
              </div>
            </div>

            {/* Custom SVG Data Charts Section */}
            {monthlyStats && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. Monthly Revenue Bar Chart */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                  <h3 className="text-slate-900 font-bold text-sm tracking-widest uppercase mb-6 border-b border-slate-100 pb-2">Monthly Billed Revenue (USD)</h3>
                  
                  {/* SVG Bar chart */}
                  <div className="h-64 flex items-end justify-between space-x-1 font-mono text-[9px] text-slate-400">
                    {monthlyStats.months.map((m, i) => {
                      const value = monthlyStats.revenue[i];
                      const max = Math.max(...monthlyStats.revenue);
                      const heightPercent = max > 0 ? (value / max) * 100 : 0;
                      return (
                        <div key={i} className="flex flex-col items-center flex-grow group relative cursor-pointer">
                          {/* Tooltip */}
                          <span className="absolute bottom-full mb-1 bg-slate-900 border border-slate-800 text-indigo-400 font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            ${value}
                          </span>
                          {/* Bar */}
                          <div 
                            style={{ height: `${heightPercent}%` }}
                            className="w-full bg-indigo-600/90 hover:bg-indigo-500 rounded-t-lg transition-all min-h-[4px]"
                          ></div>
                          <span className="mt-2 text-slate-500">{m}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Fleet Category Distribution Donut / Circle Representation */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-slate-900 font-bold text-sm tracking-widest uppercase mb-6 border-b border-slate-100 pb-2">Fleet Category Load</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                    {/* SVG Pie/Circle chart */}
                    <div className="flex justify-center">
                      <svg className="w-36 h-36 transform -rotate-90">
                        <circle cx="72" cy="72" r="50" fill="transparent" stroke="#f1f5f9" strokeWidth="16" />
                        <circle 
                          cx="72" cy="72" r="50" 
                          fill="transparent" 
                          stroke="#4f46e5" 
                          strokeWidth="16" 
                          strokeDasharray="314.15" 
                          strokeDashoffset="125" 
                        />
                      </svg>
                    </div>

                    <div className="space-y-3 font-sans text-xs">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center space-x-2"><span className="w-3 h-3 bg-indigo-600 rounded-full"></span> <span className="text-slate-600">Luxury</span></span>
                        <span className="text-slate-900 font-bold">{reportVehicles?.categories?.Luxury || 0} Listed</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center space-x-2"><span className="w-3 h-3 bg-indigo-400 rounded-full"></span> <span className="text-slate-600">Sports</span></span>
                        <span className="text-slate-900 font-bold">{reportVehicles?.categories?.Sports || 0} Listed</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center space-x-2"><span className="w-3 h-3 bg-blue-600 rounded-full"></span> <span className="text-slate-600">Electric</span></span>
                        <span className="text-slate-900 font-bold">{reportVehicles?.categories?.Electric || 0} Listed</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center space-x-2"><span className="w-3 h-3 bg-slate-400 rounded-full"></span> <span className="text-slate-600">Standard</span></span>
                        <span className="text-slate-900 font-bold">{reportVehicles?.categories?.Standard || 0} Listed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VEHICLES TAB */}
        {activeTab === "vehicles" && (
          <div className="space-y-6 animate-fadeIn" id="admin-vehicles-tab">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase">Vehicles Inventory</h1>
                <p className="text-slate-500 text-xs mt-1">Catalog management, listings addition, price revisions.</p>
              </div>
              <button
                onClick={handleOpenAddModal}
                className="bg-indigo-600 text-white hover:bg-indigo-500 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center space-x-1.5 cursor-pointer shadow-md shadow-indigo-600/10"
              >
                <Plus className="h-4 w-4 stroke-[3]" />
                <span>List New Vehicle</span>
              </button>
            </div>

            {/* Search */}
            <div className="max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search brand or model name..."
                  value={searchVehicles}
                  onChange={(e) => setSearchVehicles(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* List Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-mono text-xs text-slate-500 uppercase">
                    <th className="p-4">Vehicle Specs</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Fuel</th>
                    <th className="p-4">Daily Rate</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredVehs.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={v.images[0]}
                            alt={v.name}
                            referrerPolicy="no-referrer"
                            className="w-14 h-10 object-cover rounded border border-slate-100 bg-slate-50"
                          />
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{v.name}</p>
                            <p className="text-[10px] text-indigo-600 font-mono">{v.brand} • ID: {v.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 capitalize text-slate-600">{v.type} ({v.category})</td>
                      <td className="p-4 text-slate-500">{v.fuelType}</td>
                      <td className="p-4 font-bold text-slate-900">${v.pricePerDay}</td>
                      <td className="p-4">
                        <button
                          onClick={async () => {
                            try {
                              await api.put(`/api/vehicles/${v.id}`, { availability: !v.availability });
                              showToast("Availability state toggled!", "success");
                              refreshAllData();
                            } catch (err) {
                              showToast("Failed to toggle availability.", "error");
                            }
                          }}
                          className={`text-xs px-2 py-1 rounded font-semibold border cursor-pointer ${
                            v.availability
                              ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                              : "bg-rose-50 border-rose-200 text-rose-600"
                          }`}
                        >
                          {v.availability ? "Available" : "Suspended"}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(v)}
                            className="p-1 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteVehicle(v.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <div className="space-y-6 animate-fadeIn" id="admin-users-tab">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase">Client Accounts Management</h1>
              <p className="text-slate-500 text-xs mt-1">Suspend profiles, elevate permissions to administrator, analyze user lists.</p>
            </div>

            <div className="max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by username, email or phone..."
                  value={searchUsers}
                  onChange={(e) => setSearchUsers(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-mono text-xs text-slate-500 uppercase">
                    <th className="p-4">User Details</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Driving License</th>
                    <th className="p-4">System Role</th>
                    <th className="p-4">Account Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsrs.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <div>
                          <p className="font-bold text-slate-900">{u.username}</p>
                          <p className="text-xs text-slate-400 font-mono">{u.email}</p>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-xs text-slate-600">{u.phone}</td>
                      <td className="p-4 font-mono text-xs text-slate-400">{u.licenseNumber || "N/A"}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleUserRole(u)}
                          className={`text-xs px-2.5 py-0.5 rounded font-bold uppercase tracking-wider cursor-pointer border ${
                            u.role === "admin" ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-slate-100 border-slate-200 text-slate-500"
                          }`}
                          title="Click to toggle system role"
                        >
                          {u.role}
                        </button>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleSuspendUser(u)}
                          className={`text-xs px-2 py-0.5 rounded font-semibold border cursor-pointer ${
                            u.isSuspended
                              ? "bg-rose-50 border-rose-200 text-rose-600"
                              : "bg-emerald-50 border-emerald-200 text-emerald-600"
                          }`}
                          title="Click to toggle account status"
                        >
                          {u.isSuspended ? "Suspended" : "Active"}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === "bookings" && (
          <div className="space-y-6 animate-fadeIn" id="admin-bookings-tab">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase">System Reservations</h1>
                <p className="text-slate-500 text-xs mt-1">Accept booking requests, mark completions, cancel allocations.</p>
              </div>

              {/* Filter */}
              <select
                value={filterBookingStatus}
                onChange={(e) => setFilterBookingStatus(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 font-semibold shadow-sm"
              >
                <option value="all">All Booking States</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by client username or vehicle name..."
                  value={searchBookings}
                  onChange={(e) => setSearchBookings(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-mono text-xs text-slate-500 uppercase">
                    <th className="p-4">Customer</th>
                    <th className="p-4">Rented Vehicle</th>
                    <th className="p-4">Dates / Duration</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Workflow Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBks.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <div>
                          <p className="font-bold text-slate-900">{b.userName}</p>
                          <p className="text-xs text-slate-400 font-mono">{b.userEmail}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <img
                            src={b.vehicleImage}
                            alt={b.vehicleName}
                            referrerPolicy="no-referrer"
                            className="w-10 h-7 object-cover rounded border border-slate-100 bg-slate-50"
                          />
                          <p className="font-semibold text-slate-900 truncate max-w-[120px] text-xs">{b.vehicleName}</p>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-xs text-slate-600">
                        <span>{b.startDate} to {b.endDate}</span>
                        <span className="block text-[10px] text-slate-400">{b.totalDays} Days</span>
                      </td>
                      <td className="p-4 font-bold text-indigo-600">${b.totalAmount}</td>
                      <td className="p-4">
                        <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          b.status === "Confirmed" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                          b.status === "Completed" ? "bg-blue-50 text-blue-600 border-blue-200" :
                          b.status === "Pending" ? "bg-amber-50 text-amber-600 border-amber-200" :
                          "bg-slate-50 text-slate-500 border-slate-200"
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end space-x-1.5">
                          {b.status === "Pending" && (
                            <button
                              onClick={() => handleUpdateBookingStatus(b.id, "Confirmed")}
                              className="text-xs bg-emerald-600 text-white hover:bg-emerald-500 px-2.5 py-1.5 rounded-lg font-bold cursor-pointer shadow-sm"
                            >
                              Confirm
                            </button>
                          )}
                          {b.status === "Confirmed" && (
                            <button
                              onClick={() => handleUpdateBookingStatus(b.id, "Completed")}
                              className="text-xs bg-indigo-600 text-white hover:bg-indigo-500 px-2.5 py-1.5 rounded-lg font-bold cursor-pointer shadow-sm"
                            >
                              Complete
                            </button>
                          )}
                          {(b.status === "Pending" || b.status === "Confirmed") && (
                            <button
                              onClick={() => handleUpdateBookingStatus(b.id, "Cancelled")}
                              className="text-xs bg-white text-rose-600 hover:bg-rose-50 border border-slate-200 px-2.5 py-1.5 rounded-lg font-bold cursor-pointer transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === "payments" && (
          <div className="space-y-6 animate-fadeIn" id="admin-payments-tab">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase">Financial Ledger</h1>
              <p className="text-slate-500 text-xs mt-1">Track customer payments, Razorpay order states, trigger full refunds.</p>
            </div>

            <div className="max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search transaction ID or client email..."
                  value={searchPayments}
                  onChange={(e) => setSearchPayments(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-mono text-xs text-slate-500 uppercase">
                    <th className="p-4">TXN Ref</th>
                    <th className="p-4">Client Email</th>
                    <th className="p-4">Fare</th>
                    <th className="p-4">Tax (GST)</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPays.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-mono text-xs text-indigo-600 font-bold">{p.transactionId}</td>
                      <td className="p-4 text-slate-600">{p.userEmail}</td>
                      <td className="p-4 text-slate-700">${p.amount}</td>
                      <td className="p-4 text-slate-400">${p.tax}</td>
                      <td className="p-4 font-bold text-slate-900">${p.grandTotal}</td>
                      <td className="p-4">
                        <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          p.status === "Success" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                          p.status === "Refunded" ? "bg-blue-50 text-blue-600 border-blue-200" :
                          "bg-rose-50 text-rose-600 border-rose-200"
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {p.status === "Success" && (
                          <button
                            onClick={() => handleRefundPayment(p.id)}
                            className="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-100 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                          >
                            Refund Transaction
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div className="space-y-6 animate-fadeIn" id="admin-reviews-tab">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase">User Reviews Moderation</h1>
              <p className="text-slate-500 text-xs mt-1">Review feedback, average rating scores, remove inappropriate remarks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-slate-900 font-bold text-sm">{rev.userName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Vehicle Ref: {rev.vehicleId} • Date: {new Date(rev.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed italic">"{rev.comment}"</p>
                  <div className="flex justify-end pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleDeleteReview(rev.id)}
                      className="flex items-center space-x-1.5 text-xs text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Moderation: Remove Review</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* OVERLAY MODAL FOR VEHICLE LIST / EDIT */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn" id="vehicle-modal">
          <div className="bg-white border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 space-y-6 relative shadow-xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 text-sm font-bold p-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer transition-colors"
            >
              ✕
            </button>

            <div>
              <h2 className="text-slate-900 font-extrabold text-lg">{editVehicleId ? "Edit Listed Vehicle" : "List New Premium Vehicle"}</h2>
              <p className="text-slate-500 text-xs">Verify brand, specs, pricing, features list, and cover photo link.</p>
            </div>

            <form onSubmit={handleSaveVehicle} className="space-y-4 font-sans text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">VEHICLE BRAND</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tesla, BMW, Porsche"
                    value={vehBrand}
                    onChange={(e) => setVehBrand(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">VEHICLE MODEL NAME</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Model Y Long Range"
                    value={vehName}
                    onChange={(e) => setVehName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">FLEET TYPE</label>
                  <select
                    value={vehType}
                    onChange={(e) => setVehType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  >
                    <option value="car">Car</option>
                    <option value="bike">Bike</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">ELITE CATEGORY</label>
                  <select
                    value={vehCategory}
                    onChange={(e) => setVehCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Sports">Sports</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">FUEL CLASS</label>
                  <select
                    value={vehFuel}
                    onChange={(e) => setVehFuel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">TRANSMISSION</label>
                  <select
                    value={vehTrans}
                    onChange={(e) => setVehTrans(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">DAILY RENT (USD)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 120"
                    value={vehPrice}
                    onChange={(e) => setVehPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">CAPACITY (SEATS)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 4"
                    value={vehSeats}
                    onChange={(e) => setVehSeats(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">MILEAGE / DRIVING RANGE</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 300 miles range / 25 mpg"
                    value={vehMileage}
                    onChange={(e) => setVehMileage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">COVER IMAGE URL</label>
                  <input
                    type="url"
                    placeholder="Paste high-res Unsplash link..."
                    value={vehImage}
                    onChange={(e) => setVehImage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">VEHICLE HIGHLIGHT FEATURES (COMMA SEPARATED)</label>
                <input
                  type="text"
                  placeholder="Autopilot, 17-inch screen, Premium audio, Heated seats"
                  value={vehFeatures}
                  onChange={(e) => setVehFeatures(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">FULL CAR DESCRIPTION</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain driving conditions, battery pack / engine specifications, trim, etc."
                  value={vehDesc}
                  onChange={(e) => setVehDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-sm transition-colors cursor-pointer shadow-md shadow-indigo-600/10"
              >
                {editVehicleId ? "Save Revisions" : "Publish Listing"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM TOAST NOTIFICATION OVERLAY */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-[200] flex items-center space-x-2 px-4 py-3 rounded-xl shadow-lg border text-white animate-fadeIn ${
          toast.type === "error" ? "bg-rose-600 border-rose-500" : "bg-emerald-600 border-emerald-500"
        }`}>
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* CUSTOM CONFIRM DIALOG OVERLAY */}
      {confirmState.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[150] animate-fadeIn">
          <div className="bg-white border border-slate-200 max-w-sm w-full rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-slate-900 font-bold text-base">{confirmState.title}</h3>
            <p className="text-slate-500 text-xs leading-relaxed">{confirmState.message}</p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setConfirmState({ isOpen: false, title: "", message: "", onConfirm: null })}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmState.onConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
