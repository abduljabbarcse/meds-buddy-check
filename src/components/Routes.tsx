import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader } from "@/components/Loader";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();

  if (isLoading) return <Loader />;
  if (!session) return <Navigate to="/login" replace />;

  return children;
};

export const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();

  if (isLoading) return <Loader />;
  if (session) return <Navigate to="/" replace />;

  return children;
};
