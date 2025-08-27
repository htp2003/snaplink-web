// router/RoleBasedRedirect.tsx - UPDATED: MODERATOR GOES DIRECT TO CONTENT
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RoleBasedRedirect: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin: goes to dashboard (/admin)
  // Moderator: goes directly to content moderation (/moderator/content)
  const redirectPath = user.role === "admin" ? "/admin" : "/moderator/content";

  return <Navigate to={redirectPath} replace />;
};

export default RoleBasedRedirect;
