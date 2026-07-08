import axios from "axios";

// Static Initial Seed Data (matches server.js perfectly)
const initialUsers = [
  {
    id: "user-1",
    username: "admin",
    email: "admin@vehiclerental.com",
    phone: "9876543210",
    licenseNumber: "DL-ADMIN12345",
    address: "Admin Headquarters, New Delhi, India",
    role: "admin",
    isSuspended: false,
    password: "adminpassword",
  },
  {
    id: "user-2",
    username: "john_doe",
    email: "john@gmail.com",
    phone: "9988776655",
    licenseNumber: "DL-JD54321",
    address: "123 Green Avenue, Bangalore, India",
    role: "customer",
    isSuspended: false,
    password: "userpassword",
  }
];

const initialVehicles = [
  {
    id: "veh-1",
    name: "Tesla Model S Plaid",
    brand: "Tesla",
    type: "car",
    category: "Electric",
    fuelType: "Electric",
    transmission: "Automatic",
    availability: true,
    pricePerDay: 150,
    seats: 5,
    mileage: "396 miles (Range)",
    images: ["https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80"],
    description: "Experience the pinnacle of electric performance with the Tesla Model S Plaid. Featuring tri-motor all-wheel drive, mind-bending acceleration, and an ultra-futuristic yoke steering wheel.",
    features: ["Autopilot", "17-inch Cinematic Display", "HEPA Air Filtration", "Premium Audio", "Heated & Ventilated Seats"],
    ratings: 4.9,
  },
  {
    id: "veh-2",
    name: "BMW M4 Competition",
    brand: "BMW",
    type: "car",
    category: "Sports",
    fuelType: "Petrol",
    transmission: "Automatic",
    availability: true,
    pricePerDay: 180,
    seats: 4,
    mileage: "23 mpg",
    images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80"],
    description: "The BMW M4 Competition Coupe offers high-performance track-inspired power combined with luxury features. Driven by a twin-turbo 3.0L inline-6 cylinder engine with 503 HP.",
    features: ["M Sport Differential", "Head-Up Display", "Harman Kardon Sound", "Carbon Fiber Trim", "Launch Control"],
    ratings: 4.8,
  },
  {
    id: "veh-3",
    name: "Porsche 911 Carrera S",
    brand: "Porsche",
    type: "car",
    category: "Luxury",
    fuelType: "Petrol",
    transmission: "Automatic",
    availability: true,
    pricePerDay: 250,
    seats: 4,
    mileage: "20 mpg",
    images: ["https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80"],
    description: "The absolute benchmark of sports cars. Elegant curves, precision rear-engine layout, and incredible throttle response makes the Porsche 911 an iconic rental for special occasions.",
    features: ["Sport Chrono Package", "PASM Active Suspension", "Bose Surround Sound", "Apple CarPlay", "Alcantara Steering"],
    ratings: 5.0,
  },
  {
    id: "veh-4",
    name: "Hyundai Ioniq 5",
    brand: "Hyundai",
    type: "car",
    category: "Electric",
    fuelType: "Electric",
    transmission: "Automatic",
    availability: true,
    pricePerDay: 90,
    seats: 5,
    mileage: "303 miles (Range)",
    images: ["https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=800&q=80"],
    description: "The retro-futuristic Hyundai Ioniq 5 is a spacious, modern, and high-tech SUV with ultra-fast charging capabilities. Perfect for a smooth and sustainable family road trip.",
    features: ["Ultra-fast 800V charging", "Sliding Center Console", "Dual 12.3-inch Screens", "V2L (Vehicle to Load)", "Quiet Cabin"],
    ratings: 4.7,
  },
  {
    id: "veh-5",
    name: "Harley Davidson Iron 883",
    brand: "Harley Davidson",
    type: "bike",
    category: "Sports",
    fuelType: "Petrol",
    transmission: "Manual",
    availability: true,
    pricePerDay: 70,
    seats: 2,
    mileage: "51 mpg",
    images: ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80"],
    description: "The original icon of the Harley-Davidson Dark Custom style. Blacked-out, stripped-down, and powered by an 883cc Evolution engine for raw cruising pleasure.",
    features: ["Blacked-Out Styling", "Tuck and Roll Seat", "Machined 9-Spoke Wheels", "Drag-Style Handlebars"],
    ratings: 4.6,
  },
  {
    id: "veh-6",
    name: "Royal Enfield Classic 350",
    brand: "Royal Enfield",
    type: "bike",
    category: "Standard",
    fuelType: "Petrol",
    transmission: "Manual",
    availability: true,
    pricePerDay: 40,
    seats: 2,
    mileage: "35 km/l",
    images: ["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80"],
    description: "Classic design, timeless elegance, and the famous thumbing exhaust beat. The Royal Enfield Classic 350 is built for leisure journeys through beautiful scenic routes.",
    features: ["Classic Retro Instruments", "Dual Channel ABS", "Comfortable Split Seats", "Vintage Headlamp"],
    ratings: 4.5,
  },
  {
    id: "veh-7",
    name: "Vespa Elettrica",
    brand: "Vespa",
    type: "bike",
    category: "Electric",
    fuelType: "Electric",
    transmission: "Automatic",
    availability: true,
    pricePerDay: 30,
    seats: 2,
    mileage: "100 km (Range)",
    images: ["https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80"],
    description: "Iconic Italian scooter style meets silent, green electric performance. Extremely easy to ride in city traffic and perfect for quick shopping trips or coastal cruising.",
    features: ["4.3-inch TFT Dashboard", "Under-seat Storage", "Vespa App Connectivity", "Reverse Mode"],
    ratings: 4.4,
  }
];

const initialBookings = [
  {
    id: "bk-1",
    userId: "user-2",
    userEmail: "john@gmail.com",
    userName: "john_doe",
    vehicleId: "veh-1",
    vehicleName: "Tesla Model S Plaid",
    vehicleImage: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    startDate: "2026-07-05",
    endDate: "2026-07-08",
    totalDays: 3,
    totalAmount: 450,
    status: "Confirmed",
    createdAt: "2026-06-28T10:00:00.000Z",
  },
  {
    id: "bk-2",
    userId: "user-2",
    userEmail: "john@gmail.com",
    userName: "john_doe",
    vehicleId: "veh-5",
    vehicleName: "Harley Davidson Iron 883",
    vehicleImage: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
    startDate: "2026-06-15",
    endDate: "2026-06-17",
    totalDays: 2,
    totalAmount: 140,
    status: "Completed",
    createdAt: "2026-06-14T11:30:00.000Z",
  }
];

const initialReviews = [
  {
    id: "rev-1",
    userId: "user-2",
    userName: "john_doe",
    vehicleId: "veh-1",
    rating: 5,
    comment: "This Tesla Plaid is absolutely crazy! Fast, silent, and clean. Truly loved renting it.",
    createdAt: "2026-06-29T14:20:00.000Z",
  },
  {
    id: "rev-2",
    userId: "user-2",
    userName: "john_doe",
    vehicleId: "veh-5",
    rating: 4,
    comment: "Awesome cruiser bike. The exhaust thump is amazing. Minor wear and tear but superb handling.",
    createdAt: "2026-06-18T09:15:00.000Z",
  }
];

const initialPayments = [
  {
    id: "pay-1",
    bookingId: "bk-1",
    userId: "user-2",
    userEmail: "john@gmail.com",
    amount: 450,
    tax: 81,
    grandTotal: 531,
    status: "Success",
    transactionId: "TXN_837492817",
    createdAt: "2026-06-28T10:05:00.000Z",
    refundStatus: "Not Requested",
  },
  {
    id: "pay-2",
    bookingId: "bk-2",
    userId: "user-2",
    userEmail: "john@gmail.com",
    amount: 140,
    tax: 25.2,
    grandTotal: 165.2,
    status: "Success",
    transactionId: "TXN_736281948",
    createdAt: "2026-06-14T11:35:00.000Z",
    refundStatus: "Not Requested",
  }
];

// Seed to LocalStorage if empty
const seedDatabase = () => {
  if (!localStorage.getItem("vr_users")) {
    localStorage.setItem("vr_users", JSON.stringify(initialUsers));
  }
  if (!localStorage.getItem("vr_vehicles")) {
    localStorage.setItem("vr_vehicles", JSON.stringify(initialVehicles));
  }
  if (!localStorage.getItem("vr_bookings")) {
    localStorage.setItem("vr_bookings", JSON.stringify(initialBookings));
  }
  if (!localStorage.getItem("vr_reviews")) {
    localStorage.setItem("vr_reviews", JSON.stringify(initialReviews));
  }
  if (!localStorage.getItem("vr_payments")) {
    localStorage.setItem("vr_payments", JSON.stringify(initialPayments));
  }
};

seedDatabase();

// Local DB Getters and Setters
const getDB = (key) => JSON.parse(localStorage.getItem(key) || "[]");
const saveDB = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const getNextId = (prefix, list) => {
  const ids = list.map(item => parseInt(item.id.replace(prefix, ""))).filter(num => !isNaN(num));
  const max = ids.length > 0 ? Math.max(...ids) : 0;
  return `${prefix}${max + 1}`;
};

// Authentication helper
const authenticateUser = (headers) => {
  const authHeader = headers?.Authorization || headers?.authorization;
  if (!authHeader) return { error: "Authentication required", status: 401 };

  const token = authHeader.split(" ")[1];
  if (!token) return { error: "Authentication required", status: 401 };

  const match = token.match(/mock-access-token-(.+)/);
  if (!match) return { error: "Invalid or expired token", status: 403 };

  const userId = match[1];
  const users = getDB("vr_users");
  const user = users.find(u => u.id === userId);

  if (!user) return { error: "User not found", status: 404 };
  if (user.isSuspended) {
    return { error: "Your account is suspended. Please contact support.", status: 403 };
  }

  return { user };
};

// Response generators
const ok = (data, status = 200) => ({
  data,
  status,
  statusText: "OK",
  headers: { "content-type": "application/json" },
  config: {},
});

const err = (message, status = 400) => {
  const errorObj = new Error(message);
  errorObj.response = {
    data: { message },
    status,
    statusText: "Error",
    headers: {},
  };
  throw errorObj;
};

// Interceptor request router
const handleMockRequest = async (config) => {
  const url = config.url || "";
  const method = (config.method || "get").toLowerCase();
  const body = config.data ? (typeof config.data === "string" ? JSON.parse(config.data) : config.data) : {};
  const params = config.params || {};

  // Extract auth context
  const auth = authenticateUser(config.headers);

  // 1. POST /api/register/
  if (url === "/api/register/" && method === "post") {
    const { username, email, phone, licenseNumber, address, password } = body;
    if (!username || !email || !password || !phone) {
      return err("Please fill out all required fields", 400);
    }
    const users = getDB("vr_users");
    if (users.some(u => u.email === email)) {
      return err("Email is already registered", 400);
    }
    if (users.some(u => u.username === username)) {
      return err("Username is already taken", 400);
    }

    const newUser = {
      id: getNextId("user-", users),
      username,
      email,
      phone,
      licenseNumber: licenseNumber || "",
      address: address || "",
      role: "customer",
      isSuspended: false,
      password: password,
    };

    users.push(newUser);
    saveDB("vr_users", users);

    const { password: _, ...userWithoutPassword } = newUser;
    return ok({
      message: "Registration successful!",
      user: userWithoutPassword,
      access: `mock-access-token-${newUser.id}`,
      refresh: `mock-refresh-token-${newUser.id}`,
    }, 201);
  }

  // 2. POST /api/login/
  if (url === "/api/login/" && method === "post") {
    const { username, password } = body;
    if (!username || !password) {
      return err("Username and password are required", 400);
    }
    const users = getDB("vr_users");
    const user = users.find(u => (u.username === username || u.email === username) && u.password === password);

    if (!user) {
      return err("Invalid username/email or password", 401);
    }
    if (user.isSuspended) {
      return err("Your account is suspended. Please contact support.", 403);
    }

    const { password: _, ...userWithoutPassword } = user;
    return ok({
      access: `mock-access-token-${user.id}`,
      refresh: `mock-refresh-token-${user.id}`,
      user: userWithoutPassword,
    });
  }

  // 3. POST /api/token/refresh/
  if (url === "/api/token/refresh/" && method === "post") {
    const { refresh } = body;
    if (!refresh) return err("Refresh token is required", 400);
    const match = refresh.match(/mock-refresh-token-(.+)/);
    if (!match) return err("Invalid refresh token", 403);
    const userId = match[1];
    const users = getDB("vr_users");
    const user = users.find(u => u.id === userId);
    if (!user) return err("User not found", 404);
    return ok({ access: `mock-access-token-${user.id}` });
  }

  // 4. GET /api/profile/
  if (url === "/api/profile/" && method === "get") {
    if (auth.error) return err(auth.error, auth.status);
    const { password, ...userWithoutPassword } = auth.user;
    return ok(userWithoutPassword);
  }

  // 5. POST /api/change-password/
  if (url === "/api/change-password/" && method === "post") {
    if (auth.error) return err(auth.error, auth.status);
    const { current_password, new_password } = body;
    const users = getDB("vr_users");
    const idx = users.findIndex(u => u.id === auth.user.id);
    if (idx === -1) return err("User not found", 404);

    if (users[idx].password !== current_password) {
      return err("Incorrect current password", 400);
    }
    users[idx].password = new_password;
    saveDB("vr_users", users);
    return ok({ message: "Password updated successfully!" });
  }

  // 6. POST /api/forgot-password/
  if (url === "/api/forgot-password/" && method === "post") {
    const { email } = body;
    const users = getDB("vr_users");
    const user = users.find(u => u.email === email);
    if (!user) return err("Email not found", 404);
    return ok({ message: "Password reset link sent to your registered email address!" });
  }

  // 7. POST /api/reset-password/
  if (url === "/api/reset-password/" && method === "post") {
    const { email, new_password } = body;
    const users = getDB("vr_users");
    const idx = users.findIndex(u => u.email === email);
    if (idx === -1) return err("Email not found", 404);
    users[idx].password = new_password;
    saveDB("vr_users", users);
    return ok({ message: "Password has been successfully reset!" });
  }

  // 8. GET /api/vehicles/
  if (url === "/api/vehicles/" && method === "get") {
    const vehicles = getDB("vr_vehicles");
    return ok(vehicles);
  }

  // 9. POST /api/vehicles/
  if (url === "/api/vehicles/" && method === "post") {
    if (auth.error) return err(auth.error, auth.status);
    if (auth.user.role !== "admin") return err("Unauthorized. Admin role required.", 403);

    const { name, brand, type, category, fuelType, transmission, pricePerDay, seats, mileage, images, description, features } = body;
    if (!name || !brand || !type || !category || !fuelType || !transmission || !pricePerDay) {
      return err("Please fill out all required fields", 400);
    }

    const vehicles = getDB("vr_vehicles");
    const newVehicle = {
      id: getNextId("veh-", vehicles),
      name,
      brand,
      type,
      category,
      fuelType,
      transmission,
      availability: true,
      pricePerDay: Number(pricePerDay),
      seats: Number(seats) || 4,
      mileage: mileage || "20 mpg",
      images: images && images.length > 0 ? images : ["https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80"],
      description: description || "A beautiful rental vehicle.",
      features: typeof features === "string" ? features.split(",").map(f => f.trim()) : (features || []),
      ratings: 5.0,
    };

    vehicles.push(newVehicle);
    saveDB("vr_vehicles", vehicles);
    return ok(newVehicle, 201);
  }

  // 10. PUT /api/vehicles/:id
  const putVehMatch = url.match(/^\/api\/vehicles\/([^/]+)$/);
  if (putVehMatch && method === "put") {
    if (auth.error) return err(auth.error, auth.status);
    if (auth.user.role !== "admin") return err("Unauthorized. Admin role required.", 403);

    const id = putVehMatch[1];
    const vehicles = getDB("vr_vehicles");
    const idx = vehicles.findIndex(v => v.id === id);
    if (idx === -1) return err("Vehicle not found", 404);

    const updated = {
      ...vehicles[idx],
      ...body,
      id: vehicles[idx].id,
      pricePerDay: body.pricePerDay !== undefined ? Number(body.pricePerDay) : vehicles[idx].pricePerDay,
      seats: body.seats !== undefined ? Number(body.seats) : vehicles[idx].seats,
      features: typeof body.features === "string" ? body.features.split(",").map(f => f.trim()) : (body.features || vehicles[idx].features),
    };

    vehicles[idx] = updated;
    saveDB("vr_vehicles", vehicles);
    return ok(updated);
  }

  // 11. DELETE /api/vehicles/:id
  if (putVehMatch && method === "delete") {
    if (auth.error) return err(auth.error, auth.status);
    if (auth.user.role !== "admin") return err("Unauthorized. Admin role required.", 403);

    const id = putVehMatch[1];
    const vehicles = getDB("vr_vehicles");
    const idx = vehicles.findIndex(v => v.id === id);
    if (idx === -1) return err("Vehicle not found", 404);

    vehicles.splice(idx, 1);
    saveDB("vr_vehicles", vehicles);
    return ok({ message: "Vehicle deleted successfully." });
  }

  // 12. POST /api/check-availability/
  if (url === "/api/check-availability/" && method === "post") {
    const { vehicleId, startDate, endDate } = body;
    if (!vehicleId || !startDate || !endDate) {
      return err("Vehicle ID, Start Date, and End Date are required", 400);
    }

    const vehicles = getDB("vr_vehicles");
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return err("Vehicle not found", 404);

    if (!vehicle.availability) {
      return ok({ available: false, message: "Vehicle is marked as unavailable overall." });
    }

    const bookings = getDB("vr_bookings");
    const conflicts = bookings.filter(b => {
      if (b.vehicleId !== vehicleId) return false;
      if (b.status === "Cancelled") return false;

      const start1 = new Date(b.startDate).getTime();
      const end1 = new Date(b.endDate).getTime();
      const start2 = new Date(startDate).getTime();
      const end2 = new Date(endDate).getTime();

      return start1 <= end2 && end1 >= start2;
    });

    if (conflicts.length > 0) {
      return ok({ available: false, message: "Vehicle is booked or reserved for these dates." });
    }
    return ok({ available: true, message: "Vehicle is available for the selected dates!" });
  }

  // 13. GET /api/bookings/
  if (url === "/api/bookings/" && method === "get") {
    if (auth.error) return err(auth.error, auth.status);
    const bookings = getDB("vr_bookings");
    if (auth.user.role === "admin") {
      return ok(bookings);
    } else {
      return ok(bookings.filter(b => b.userId === auth.user.id));
    }
  }

  // 14. POST /api/bookings/
  if (url === "/api/bookings/" && method === "post") {
    if (auth.error) return err(auth.error, auth.status);
    const { vehicleId, startDate, endDate } = body;
    if (!vehicleId || !startDate || !endDate) {
      return err("Vehicle ID, Start Date and End Date are required", 400);
    }

    const vehicles = getDB("vr_vehicles");
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return err("Vehicle not found", 404);

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const totalAmount = vehicle.pricePerDay * totalDays;

    const bookings = getDB("vr_bookings");
    const newBooking = {
      id: getNextId("bk-", bookings),
      userId: auth.user.id,
      userEmail: auth.user.email,
      userName: auth.user.username,
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      vehicleImage: vehicle.images[0],
      startDate,
      endDate,
      totalDays,
      totalAmount,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    bookings.push(newBooking);
    saveDB("vr_bookings", bookings);
    return ok(newBooking, 201);
  }

  // 15. PUT /api/bookings/:id
  const putBookingMatch = url.match(/^\/api\/bookings\/([^/]+)$/);
  if (putBookingMatch && method === "put") {
    if (auth.error) return err(auth.error, auth.status);
    const id = putBookingMatch[1];
    const { status } = body;

    const bookings = getDB("vr_bookings");
    const idx = bookings.findIndex(b => b.id === id);
    if (idx === -1) return err("Booking not found", 404);

    const booking = bookings[idx];
    if (auth.user.role !== "admin" && booking.userId !== auth.user.id) {
      return err("Unauthorized to update this booking", 403);
    }
    if (auth.user.role !== "admin" && status !== "Cancelled") {
      return err("Customers can only cancel bookings.", 403);
    }

    booking.status = status;
    bookings[idx] = booking;
    saveDB("vr_bookings", bookings);
    return ok(booking);
  }

  // 16. DELETE /api/bookings/:id
  if (putBookingMatch && method === "delete") {
    if (auth.error) return err(auth.error, auth.status);
    if (auth.user.role !== "admin") return err("Unauthorized. Admin role required.", 403);

    const id = putBookingMatch[1];
    const bookings = getDB("vr_bookings");
    const idx = bookings.findIndex(b => b.id === id);
    if (idx === -1) return err("Booking not found", 404);

    bookings.splice(idx, 1);
    saveDB("vr_bookings", bookings);
    return ok({ message: "Booking deleted successfully." });
  }

  // 17. GET /api/reviews/
  if (url.startsWith("/api/reviews/") && method === "get") {
    const reviews = getDB("vr_reviews");
    // Extract query parameter vehicleId if any
    const queryParams = new URLSearchParams(url.split("?")[1] || "");
    const vehicleId = queryParams.get("vehicleId") || params.vehicleId;
    if (vehicleId) {
      return ok(reviews.filter(r => r.vehicleId === vehicleId));
    }
    return ok(reviews);
  }

  // 18. POST /api/reviews/
  if (url === "/api/reviews/" && method === "post") {
    if (auth.error) return err(auth.error, auth.status);
    const { vehicleId, rating, comment } = body;
    if (!vehicleId || !rating || !comment) {
      return err("Vehicle ID, rating (1-5), and comment are required.", 400);
    }

    const vehicles = getDB("vr_vehicles");
    const vIdx = vehicles.findIndex(v => v.id === vehicleId);
    if (vIdx === -1) return err("Vehicle not found.", 404);

    const reviews = getDB("vr_reviews");
    const newReview = {
      id: getNextId("rev-", reviews),
      userId: auth.user.id,
      userName: auth.user.username,
      vehicleId,
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString(),
    };

    reviews.push(newReview);
    saveDB("vr_reviews", reviews);

    // Recalculate avg
    const vehicleReviews = reviews.filter(r => r.vehicleId === vehicleId);
    const avgRating = parseFloat((vehicleReviews.reduce((sum, r) => sum + r.rating, 0) / vehicleReviews.length).toFixed(1));
    vehicles[vIdx].ratings = avgRating;
    saveDB("vr_vehicles", vehicles);

    return ok(newReview, 201);
  }

  // 19. PUT /api/reviews/:id
  const putReviewMatch = url.match(/^\/api\/reviews\/([^/]+)$/);
  if (putReviewMatch && method === "put") {
    if (auth.error) return err(auth.error, auth.status);
    const id = putReviewMatch[1];
    const { rating, comment } = body;

    const reviews = getDB("vr_reviews");
    const idx = reviews.findIndex(r => r.id === id);
    if (idx === -1) return err("Review not found", 404);

    if (auth.user.role !== "admin" && reviews[idx].userId !== auth.user.id) {
      return err("Unauthorized to edit this review", 403);
    }

    reviews[idx].rating = rating !== undefined ? Number(rating) : reviews[idx].rating;
    reviews[idx].comment = comment || reviews[idx].comment;
    saveDB("vr_reviews", reviews);

    // Recalculate
    const vehicleId = reviews[idx].vehicleId;
    const vehicles = getDB("vr_vehicles");
    const vIdx = vehicles.findIndex(v => v.id === vehicleId);
    if (vIdx !== -1) {
      const vehicleReviews = reviews.filter(r => r.vehicleId === vehicleId);
      vehicles[vIdx].ratings = parseFloat((vehicleReviews.reduce((sum, r) => sum + r.rating, 0) / vehicleReviews.length).toFixed(1));
      saveDB("vr_vehicles", vehicles);
    }

    return ok(reviews[idx]);
  }

  // 20. DELETE /api/reviews/:id
  if (putReviewMatch && method === "delete") {
    if (auth.error) return err(auth.error, auth.status);
    const id = putReviewMatch[1];

    const reviews = getDB("vr_reviews");
    const idx = reviews.findIndex(r => r.id === id);
    if (idx === -1) return err("Review not found", 404);

    if (auth.user.role !== "admin" && reviews[idx].userId !== auth.user.id) {
      return err("Unauthorized to delete this review", 403);
    }

    const vehicleId = reviews[idx].vehicleId;
    reviews.splice(idx, 1);
    saveDB("vr_reviews", reviews);

    // Recalculate
    const vehicles = getDB("vr_vehicles");
    const vIdx = vehicles.findIndex(v => v.id === vehicleId);
    if (vIdx !== -1) {
      const vehicleReviews = reviews.filter(r => r.vehicleId === vehicleId);
      if (vehicleReviews.length > 0) {
        vehicles[vIdx].ratings = parseFloat((vehicleReviews.reduce((sum, r) => sum + r.rating, 0) / vehicleReviews.length).toFixed(1));
      } else {
        vehicles[vIdx].ratings = 5.0;
      }
      saveDB("vr_vehicles", vehicles);
    }

    return ok({ message: "Review deleted successfully" });
  }

  // 21. POST /api/payment/create-order/
  if (url === "/api/payment/create-order/" && method === "post") {
    if (auth.error) return err(auth.error, auth.status);
    const { bookingId } = body;
    const bookings = getDB("vr_bookings");
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return err("Booking not found", 404);

    const amount = booking.totalAmount;
    const tax = parseFloat((amount * 0.18).toFixed(2));
    const grandTotal = parseFloat((amount + tax).toFixed(2));

    return ok({
      orderId: `order_mock_${Math.random().toString(36).substring(2, 10)}`,
      bookingId: booking.id,
      amount,
      tax,
      grandTotal,
      currency: "INR",
    });
  }

  // 22. POST /api/payment/verify/
  if (url === "/api/payment/verify/" && method === "post") {
    if (auth.error) return err(auth.error, auth.status);
    const { bookingId, orderId, paymentId, status } = body;

    const bookings = getDB("vr_bookings");
    const bIdx = bookings.findIndex(b => b.id === bookingId);
    if (bIdx === -1) return err("Booking not found", 404);

    const booking = bookings[bIdx];
    const payments = getDB("vr_payments");

    if (status === "Failed") {
      const newPayment = {
        id: getNextId("pay-", payments),
        bookingId: booking.id,
        userId: auth.user.id,
        userEmail: auth.user.email,
        amount: booking.totalAmount,
        tax: parseFloat((booking.totalAmount * 0.18).toFixed(2)),
        grandTotal: parseFloat((booking.totalAmount * 1.18).toFixed(2)),
        status: "Failed",
        transactionId: paymentId || `TXN_FAILED_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      payments.push(newPayment);
      saveDB("vr_payments", payments);

      booking.status = "Cancelled";
      bookings[bIdx] = booking;
      saveDB("vr_bookings", bookings);

      return ok({ success: false, message: "Payment failed.", payment: newPayment });
    }

    // Success Payment
    booking.status = "Confirmed";
    bookings[bIdx] = booking;
    saveDB("vr_bookings", bookings);

    const newPayment = {
      id: getNextId("pay-", payments),
      bookingId: booking.id,
      userId: auth.user.id,
      userEmail: auth.user.email,
      amount: booking.totalAmount,
      tax: parseFloat((booking.totalAmount * 0.18).toFixed(2)),
      grandTotal: parseFloat((booking.totalAmount * 1.18).toFixed(2)),
      status: "Success",
      transactionId: paymentId || `TXN_${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      refundStatus: "Not Requested",
    };

    payments.push(newPayment);
    saveDB("vr_payments", payments);

    return ok({ success: true, message: "Payment successful and booking confirmed!", payment: newPayment });
  }

  // 23. GET /api/payment/history/
  if (url === "/api/payment/history/" && method === "get") {
    if (auth.error) return err(auth.error, auth.status);
    const payments = getDB("vr_payments");
    if (auth.user.role === "admin") {
      return ok(payments);
    } else {
      return ok(payments.filter(p => p.userId === auth.user.id));
    }
  }

  // 24. GET /api/payment/:id
  const putPaymentMatch = url.match(/^\/api\/payment\/([^/]+)$/);
  if (putPaymentMatch && method === "get") {
    if (auth.error) return err(auth.error, auth.status);
    const id = putPaymentMatch[1];
    const payments = getDB("vr_payments");
    const payment = payments.find(p => p.id === id || p.bookingId === id);

    if (!payment) return err("Payment transaction not found", 404);
    if (auth.user.role !== "admin" && payment.userId !== auth.user.id) {
      return err("Unauthorized to view this transaction", 403);
    }
    return ok(payment);
  }

  // 25. POST /api/payment/refund/:id
  const refundMatch = url.match(/^\/api\/payment\/refund\/([^/]+)$/);
  if (refundMatch && method === "post") {
    if (auth.error) return err(auth.error, auth.status);
    if (auth.user.role !== "admin") return err("Unauthorized. Admin role required.", 403);

    const id = refundMatch[1];
    const payments = getDB("vr_payments");
    const pIdx = payments.findIndex(p => p.id === id);
    if (pIdx === -1) return err("Payment transaction not found", 404);

    payments[pIdx].status = "Refunded";
    payments[pIdx].refundStatus = "Completed";
    saveDB("vr_payments", payments);

    const bookings = getDB("vr_bookings");
    const bIdx = bookings.findIndex(b => b.id === payments[pIdx].bookingId);
    if (bIdx !== -1) {
      bookings[bIdx].status = "Cancelled";
      saveDB("vr_bookings", bookings);
    }

    return ok({ message: "Payment refunded and booking cancelled successfully.", payment: payments[pIdx] });
  }

  // 26. GET /api/admin/users/
  if (url === "/api/admin/users/" && method === "get") {
    if (auth.error) return err(auth.error, auth.status);
    if (auth.user.role !== "admin") return err("Unauthorized. Admin role required.", 403);

    const users = getDB("vr_users");
    const safeUsers = users.map(({ password, ...u }) => u);
    return ok(safeUsers);
  }

  // 27. PUT /api/admin/users/:id
  const putUserMatch = url.match(/^\/api\/admin\/users\/([^/]+)$/);
  if (putUserMatch && method === "put") {
    if (auth.error) return err(auth.error, auth.status);
    const id = putUserMatch[1];
    const { role, isSuspended, email, phone, address, licenseNumber, username } = body;

    // Allow user to update their own profile, or admin to update anyone
    if (auth.user.role !== "admin" && auth.user.id !== id) {
      return err("Unauthorized. Admin role or self-edit required.", 403);
    }

    const users = getDB("vr_users");
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return err("User not found", 404);

    if (users[idx].id === auth.user.id && isSuspended === true) {
      return err("You cannot suspend your own admin account!", 400);
    }

    users[idx] = {
      ...users[idx],
      role: (role !== undefined && auth.user.role === "admin") ? role : users[idx].role,
      isSuspended: (isSuspended !== undefined && auth.user.role === "admin") ? isSuspended : users[idx].isSuspended,
      email: email || users[idx].email,
      phone: phone || users[idx].phone,
      address: address || users[idx].address,
      licenseNumber: licenseNumber || users[idx].licenseNumber,
      username: username || users[idx].username,
    };

    saveDB("vr_users", users);

    const { password, ...safeUser } = users[idx];
    return ok(safeUser);
  }

  // 28. DELETE /api/admin/users/:id
  if (putUserMatch && method === "delete") {
    if (auth.error) return err(auth.error, auth.status);
    if (auth.user.role !== "admin") return err("Unauthorized. Admin role required.", 403);

    const id = putUserMatch[1];
    if (id === auth.user.id) {
      return err("You cannot delete your own admin account!", 400);
    }

    const users = getDB("vr_users");
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return err("User not found", 404);

    users.splice(idx, 1);
    saveDB("vr_users", users);
    return ok({ message: "User deleted successfully." });
  }

  // 29. GET /api/reports/bookings/
  if (url === "/api/reports/bookings/" && method === "get") {
    if (auth.error) return err(auth.error, auth.status);
    if (auth.user.role !== "admin") return err("Admin role required.", 403);

    const bookings = getDB("vr_bookings");
    return ok({
      total: bookings.length,
      pending: bookings.filter(b => b.status === "Pending").length,
      confirmed: bookings.filter(b => b.status === "Confirmed").length,
      cancelled: bookings.filter(b => b.status === "Cancelled").length,
      completed: bookings.filter(b => b.status === "Completed").length,
    });
  }

  // 30. GET /api/reports/revenue/
  if (url === "/api/reports/revenue/" && method === "get") {
    if (auth.error) return err(auth.error, auth.status);
    if (auth.user.role !== "admin") return err("Admin role required.", 403);

    const payments = getDB("vr_payments");
    const successPayments = payments.filter(p => p.status === "Success");
    const totalRevenue = successPayments.reduce((sum, p) => sum + p.grandTotal, 0);
    const taxesCollected = successPayments.reduce((sum, p) => sum + p.tax, 0);
    const netRevenue = successPayments.reduce((sum, p) => sum + p.amount, 0);

    return ok({ totalRevenue, taxesCollected, netRevenue });
  }

  // 31. GET /api/reports/users/
  if (url === "/api/reports/users/" && method === "get") {
    if (auth.error) return err(auth.error, auth.status);
    if (auth.user.role !== "admin") return err("Admin role required.", 403);

    const users = getDB("vr_users");
    return ok({
      total: users.length,
      admins: users.filter(u => u.role === "admin").length,
      customers: users.filter(u => u.role === "customer").length,
      suspended: users.filter(u => u.isSuspended).length,
    });
  }

  // 32. GET /api/reports/vehicles/
  if (url === "/api/reports/vehicles/" && method === "get") {
    if (auth.error) return err(auth.error, auth.status);
    if (auth.user.role !== "admin") return err("Admin role required.", 403);

    const vehicles = getDB("vr_vehicles");
    return ok({
      total: vehicles.length,
      cars: vehicles.filter(v => v.type === "car").length,
      bikes: vehicles.filter(v => v.type === "bike").length,
      categories: {
        Luxury: vehicles.filter(v => v.category === "Luxury").length,
        Sports: vehicles.filter(v => v.category === "Sports").length,
        Electric: vehicles.filter(v => v.category === "Electric").length,
        Standard: vehicles.filter(v => v.category === "Standard").length,
      },
      available: vehicles.filter(v => v.availability).length,
    });
  }

  // 33. GET /api/reports/reviews/
  if (url === "/api/reports/reviews/" && method === "get") {
    if (auth.error) return err(auth.error, auth.status);
    if (auth.user.role !== "admin") return err("Admin role required.", 403);

    const reviews = getDB("vr_reviews");
    const ratings = reviews.map(r => r.rating);
    const average = ratings.length > 0 ? (ratings.reduce((s, r) => s + r, 0) / ratings.length) : 5.0;

    return ok({
      total: reviews.length,
      average: parseFloat(average.toFixed(2)),
    });
  }

  // 34. GET /api/reports/monthly-revenue/
  if (url === "/api/reports/monthly-revenue/" && method === "get") {
    if (auth.error) return err(auth.error, auth.status);
    if (auth.user.role !== "admin") return err("Admin role required.", 403);

    const vehicles = getDB("vr_vehicles");
    return ok({
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      revenue: [12000, 15000, 18500, 22000, 31000, 45000, 52000, 48000, 39000, 42000, 49000, 62000],
      bookings: [80, 100, 110, 140, 190, 280, 310, 290, 240, 260, 300, 380],
      categories: {
        names: ["Luxury", "Sports", "Electric", "Standard"],
        counts: [
          vehicles.filter(v => v.category === "Luxury").length,
          vehicles.filter(v => v.category === "Sports").length,
          vehicles.filter(v => v.category === "Electric").length,
          vehicles.filter(v => v.category === "Standard").length,
        ]
      }
    });
  }

  // 35. GET /api/health
  if (url === "/api/health" && method === "get") {
    return ok({ status: "healthy", timestamp: new Date() });
  }

  // Fallback
  return err(`Mock route not found: ${method.toUpperCase()} ${url}`, 404);
};

// Set Custom Adapter to Axios
const originalAdapter = axios.defaults.adapter;
axios.defaults.adapter = async (config) => {
  const url = config.url || "";
  if (url.startsWith("/api") || url.includes("/api/")) {
    return handleMockRequest(config);
  }
  if (originalAdapter) {
    return originalAdapter(config);
  }
  throw new Error(`Default adapter unavailable for non-mock url: ${url}`);
};

export default handleMockRequest;
