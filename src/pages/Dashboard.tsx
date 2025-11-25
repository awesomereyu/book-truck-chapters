import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getVolunteers, Volunteer, getDonations, setVolunteers, getCurrentUser, logout, isAdmin } from "@/lib/localStorage";
import { Download, Mail, ChevronDown, Users, Clock, MapPin, TrendingUp, Edit, LogOut } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [volunteers, setVolunteersState] = useState<Volunteer[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [editingVolunteer, setEditingVolunteer] = useState<Volunteer | null>(null);
  const [editHours, setEditHours] = useState("");
  const currentUser = getCurrentUser();

  useEffect(() => {
    // Check if user is logged in
    if (!currentUser) {
      navigate("/volunteer-login");
      return;
    }
    setVolunteersState(getVolunteers());
  }, [currentUser, navigate]);

  const getVolunteerStatus = (hours: number) => {
    if (hours < 5) return { label: "Needs Help", color: "destructive", suggestion: "Needs extra help organizing donations." };
    if (hours <= 15) return { label: "Steady", color: "secondary", suggestion: "Steady contributor — assign regular shelving tasks." };
    return { label: "High Impact", color: "default", suggestion: "High impact — assign outreach event responsibilities." };
  };

  const calculateKPIs = () => {
    const avgHours = volunteers.length > 0
      ? volunteers.reduce((sum, v) => sum + v.hours, 0) / volunteers.length
      : 0;
    const totalDonations = getDonations().length;
    const activeThisWeek = volunteers.filter(v => {
      const activityDate = new Date(v.recentActivity);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return activityDate >= weekAgo;
    }).length;

    return { avgHours, totalDonations, activeThisWeek };
  };

  const kpis = calculateKPIs();

  const handleExportDashboard = () => {
    const anonymizedData = volunteers.map(v => ({
      hours: v.hours,
      location: v.location,
      tasksCompleted: v.tasksCompleted,
    }));
    const dataStr = JSON.stringify(anonymizedData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", "dashboard-export.json");
    linkElement.click();
    toast.success("Dashboard data exported!");
  };

  const handleSendSuggestion = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    toast.success(`Email suggestion prepared for ${volunteer.name}`);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/volunteer-login");
  };

  const handleEditHours = (volunteer: Volunteer) => {
    setEditingVolunteer(volunteer);
    setEditHours(volunteer.hours.toString());
  };

  const handleSaveHours = () => {
    if (editingVolunteer) {
      const updatedVolunteers = volunteers.map(v =>
        v.id === editingVolunteer.id
          ? { ...v, hours: parseInt(editHours) || 0 }
          : v
      );
      setVolunteers(updatedVolunteers);
      setVolunteersState(updatedVolunteers);
      toast.success(`Updated hours for ${editingVolunteer.name}`);
      setEditingVolunteer(null);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container max-w-7xl mx-auto py-8 px-4 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Volunteer Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome, {currentUser.name} {isAdmin() && <Badge className="ml-2">Admin</Badge>}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportDashboard}>
              <Download className="mr-2 h-4 w-4" />
              Export Dashboard
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Hours/Volunteer</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{kpis.avgHours.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground mt-1">hours per volunteer</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{kpis.totalDonations}</div>
              <p className="text-xs text-muted-foreground mt-1">books processed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active This Week</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{kpis.activeThisWeek}</div>
              <p className="text-xs text-muted-foreground mt-1">volunteers active</p>
            </CardContent>
          </Card>
        </div>

        {/* Bar Graph */}
        <Card>
          <CardHeader>
            <CardTitle>Hours Worked Comparison</CardTitle>
            <CardDescription>Visual comparison of volunteer contributions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {volunteers.map((volunteer) => (
                <div key={volunteer.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{volunteer.name}</span>
                    <span className="text-sm text-muted-foreground">{volunteer.hours}h</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${(volunteer.hours / 25) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Volunteer Table */}
        <Card>
          <CardHeader>
            <CardTitle>Volunteer Details</CardTitle>
            <CardDescription>Complete overview of all volunteers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Hours Logged</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Recent Activity</TableHead>
                    <TableHead>Tasks Completed</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                    {isAdmin() && <TableHead>Admin</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {volunteers.map((volunteer) => {
                    const status = getVolunteerStatus(volunteer.hours);
                    return (
                      <TableRow key={volunteer.id}>
                        <TableCell className="font-medium">{volunteer.name}</TableCell>
                        <TableCell>{volunteer.hours}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {volunteer.location}
                          </div>
                        </TableCell>
                        <TableCell>{volunteer.recentActivity}</TableCell>
                        <TableCell>{volunteer.tasksCompleted}</TableCell>
                        <TableCell>
                          <Badge variant={status.color as any}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSendSuggestion(volunteer)}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </TableCell>
                        {isAdmin() && (
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditHours(volunteer)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit Hours
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Suggestions Panel */}
        <Collapsible open={suggestionsOpen} onOpenChange={setSuggestionsOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-smooth">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Volunteer Suggestions</CardTitle>
                    <CardDescription>Automated task recommendations based on activity</CardDescription>
                  </div>
                  <ChevronDown className={`h-5 w-5 transition-transform ${suggestionsOpen ? "rotate-180" : ""}`} />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-3">
                {volunteers.map((volunteer) => {
                  const status = getVolunteerStatus(volunteer.hours);
                  return (
                    <div
                      key={volunteer.id}
                      className="flex items-start justify-between p-4 rounded-lg bg-muted"
                    >
                      <div>
                        <p className="font-medium text-foreground">{volunteer.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">{status.suggestion}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSendSuggestion(volunteer)}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Send
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Email Preview */}
        {selectedVolunteer && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle>Email Preview (Simulation)</CardTitle>
              <CardDescription>This is a demonstration - no actual email will be sent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>To:</strong> {selectedVolunteer.name}@example.com</p>
                <p><strong>Subject:</strong> Task Suggestion</p>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-foreground">Hi {selectedVolunteer.name},</p>
                  <p className="mt-2 text-muted-foreground">
                    {getVolunteerStatus(selectedVolunteer.hours).suggestion}
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    Thank you for your dedication to The Second Chapter!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Hours Dialog */}
        <Dialog open={!!editingVolunteer} onOpenChange={() => setEditingVolunteer(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Volunteer Hours</DialogTitle>
              <DialogDescription>
                Update hours for {editingVolunteer?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hours">Hours Logged</Label>
                <Input
                  id="hours"
                  type="number"
                  value={editHours}
                  onChange={(e) => setEditHours(e.target.value)}
                  placeholder="Enter hours"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingVolunteer(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveHours}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
