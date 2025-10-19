import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <p className="text-2xl font-semibold text-foreground">
            Page Not Found
          </p>
        </div>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Oops! It looks like the page you're looking for doesn't exist or has
          been moved. Let's get you back on track.
        </p>
        <Button asChild size="lg" className="gap-2">
          <a href="/">
            <ArrowLeft className="h-4 w-4" />
            Return to Dashboard
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
