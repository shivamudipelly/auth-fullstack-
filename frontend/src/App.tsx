import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import NotFoundPage from "./pages/NotFoundPage";
import { AddBus, BusTable, EditUser, UserTable, AddUser, EditBus, Dashboard } from "./feature/admin";


// Contexts
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";

// Routes
import PublicRoute from "./routes/PublicRoutes";
import ProtectedRoute from "./routes/ProtectedRoute";
import { MapboxExample } from "./feature/map";
import BusesList from "./feature/map/pages/BusList";
import SimulateBusLocation from "./feature/map/pages/SimulateBusLocation";
import DriverRoute from "./routes/DriverRoute";


const App = () => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* 🌐 Public-facing Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/buses" element={<BusesList />} />
              <Route path="/buses/simulate" element={<DriverRoute><SimulateBusLocation /></DriverRoute>} />

              {/* 🔐 Authentication Routes */}
              <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
              <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
              <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
              <Route path="/verify-email" element={<PublicRoute><VerifyEmailPage /></PublicRoute>} />
            </Route>

            {/* 🛠️ Admin Routes (Protected) */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route path="" element={<Dashboard />} />

              <Route path="users" element={<UserTable />} />
              <Route path="users/edit/:userId" element={<EditUser />} />
              <Route path="users/addUser" element={<AddUser />} />

              <Route path="buses" element={<BusTable />} />
              <Route path="buses/addBus" element={<AddBus />} />
              <Route path="buses/editBus/:busId" element={<EditBus />} />
              
             


            </Route>

            <Route path="buses/map/:busId" element={<MapboxExample />} />


            {/* ❌ 404 Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </NotificationProvider>
  );
};

export default App;
