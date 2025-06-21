import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import PatientDashboard from "@/components/PatientDashboard";
import CaretakerDashboard from "@/components/CaretakerDashboard";
import { Button } from "@/components/ui/button";
import { Users, LogOut, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Index = () => {
  const { role, signOut, user } = useAuth();
  const [currentRole, setCurrentRole] = useState<"patient" | "caretaker">(
    role || "patient"
  );
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const switchUserType = () => {
    const newType = currentRole === "patient" ? "caretaker" : "patient";
    setCurrentRole(newType);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getUserInitials = () => {
    if (!user?.email) return "U";
    const names = user.email.split("@")[0].split(/[._]/);
    return names
      .map((n) => n.charAt(0).toUpperCase())
      .join("")
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <header className="bg-white/90 backdrop-blur-sm border-b border-border/20 px-6 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-md">MC</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  MediCare Companion
                </h1>
                <p className="text-xs text-muted-foreground">
                  {currentRole === "patient" ? "Patient Portal" : "Caretaker Dashboard"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {role === "caretaker" && (
              <Button
                variant="outline"
                size="sm"
                onClick={switchUserType}
                className="flex items-center gap-2 hover:bg-accent transition-colors"
              >
                <Users className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {currentRole === "patient" ? "Caretaker View" : "Patient View"}
                </span>
              </Button>
            )}

            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <p className="text-sm font-medium text-foreground">
                  {user?.email?.split("@")[0] || "User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentRole === "patient" ? "Patient" : "Caretaker"}
                </p>
              </div>

              <Avatar className="w-8 h-8 border border-border">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-blue-100 text-blue-800 text-xs font-medium">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-1.5 hover:bg-accent transition-colors"
              >
                {isLoggingOut ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <LogOut className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {currentRole === "patient" ? (
          <PatientDashboard />
        ) : (
          <CaretakerDashboard />
        )}
      </main>
    </div>
  );
};

export default Index;