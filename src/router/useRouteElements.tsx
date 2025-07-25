// router/useRouteElements.tsx - VERSION ĐƠN GIẢN
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRedirect from "./RoleBasedRedirect";

// Layouts
import AdminLayout from "../layouts/AdminLayout";
import ModeratorLayout from "../layouts/ModeratorLayout";

// Auth pages
import Login from "../pages/auth/Login";

// Admin pages
import Dashboard from "../pages/admin/Dashboard";
import UserManagement from "../pages/admin/UserManagement";
import ContentModeration from "../pages/admin/ContentModeration";
import BookingManagement from "../pages/admin/BookingManagement";
import TransactionManagement from "../pages/admin/TransactionManagement";
import Settings from "../pages/admin/Settings";

// Moderator pages
import ModeratorDashboard from "../pages/moderator/Dashboard";
import ModeratorContentModeration from "../pages/moderator/ContentModeration";
import ReportHandling from "../pages/moderator/ReportHandling";
import ModeratorUserManagement from "../pages/moderator/UserManagement";

const useRouteElements = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route
          path="/login"
          element={user ? <RoleBasedRedirect /> : <Login />}
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="content" element={<ContentModeration />} />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="transactions" element={<TransactionManagement />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Moderator routes */}
        <Route
          path="/moderator"
          element={
            <ProtectedRoute allowedRoles={["moderator"]}>
              <ModeratorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ModeratorDashboard />} />
          <Route path="content" element={<ModeratorContentModeration />} />
          <Route path="reports" element={<ReportHandling />} />
          <Route path="users" element={<ModeratorUserManagement />} />
        </Route>

        {/* Root route */}
        <Route path="/" element={<RoleBasedRedirect />} />

        {/* Catch all routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </BrowserRouter>
  );
};

export default useRouteElements;
