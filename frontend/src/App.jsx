import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navigate } from "react-router-dom";
import RegistrationClosed from "./pages/RegistrationClosed";

const HomePage = lazy(() => import("./pages/HomePage"));
const RegistrationForm = lazy(() => import("./pages/RegistrationForm"));
const RegistrationSuccess = lazy(() => import("./pages/RegistrationSuccess"));

export default function App() {
  return (
    <Router>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <Routes>
          {/* Home Page - Landing Page */}
          <Route path="/" element={<HomePage />} />

          {/* Registration Routes */}
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/registration" element={<RegistrationForm />} />
          <Route
            path="/registration-success"
            element={<RegistrationSuccess />}
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/registrations"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/new-registration"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/stats"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}
