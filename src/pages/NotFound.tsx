
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-md w-full text-center space-y-6 animate-fade-down">
        <div className="space-y-2">
          <h1 className="text-7xl font-bold text-primary">404</h1>
          <p className="text-2xl font-medium text-foreground">Page not found</p>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Button asChild variant="outline">
            <Link to={isAuthenticated ? "/dashboard" : "/"}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go back
            </Link>
          </Button>
          <Button asChild>
            <Link to={isAuthenticated ? "/dashboard" : "/"}>
              <Home className="mr-2 h-4 w-4" />
              {isAuthenticated ? "Dashboard" : "Home"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
