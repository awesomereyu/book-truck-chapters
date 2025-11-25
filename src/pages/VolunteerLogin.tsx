import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authenticateUser, getCurrentUser, initializeUsers } from "@/lib/localStorage";
import { BookOpen, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const VolunteerLogin = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    initializeUsers();
    // Redirect if already logged in
    const user = getCurrentUser();
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const user = authenticateUser(name, password);
    if (user) {
      toast.success(`Welcome back, ${user.name}!`);
      navigate("/dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-primary" />
          </div>
          <div className="space-y-2 text-center">
            <CardTitle className="text-2xl">Volunteer Login</CardTitle>
            <CardDescription>The Second Chapter - Mobile Book Truck</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full">
              Login
            </Button>

            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground font-medium mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Admin: <span className="font-mono">Admin / admin123</span></p>
                <p>Volunteer: <span className="font-mono">Sarah Chen / volunteer123</span></p>
              </div>
              <p className="text-xs text-amber-600 mt-3">
                ⚠️ Client-side prototype only - not secure for production
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VolunteerLogin;
