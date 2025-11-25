import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getVolunteers, addVolunteer, Volunteer } from "@/lib/localStorage";
import { UserPlus, Users } from "lucide-react";
import { toast } from "sonner";

export const VolunteerManager = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [isAddingVolunteer, setIsAddingVolunteer] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
  });

  useEffect(() => {
    setVolunteers(getVolunteers());
  }, []);

  const handleAdd = () => {
    setIsAddingVolunteer(true);
    setFormData({
      name: "",
      email: "",
      location: "",
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.location) {
      toast.error("Please fill in all fields");
      return;
    }

    addVolunteer({
      name: formData.name,
      email: formData.email,
      location: formData.location,
      hours: 0,
      recentActivity: new Date().toISOString().split('T')[0],
      tasksCompleted: 0,
    });
    
    setVolunteers(getVolunteers());
    toast.success("Volunteer added successfully");
    setIsAddingVolunteer(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Volunteer Management
              </CardTitle>
              <CardDescription>Add and manage volunteers</CardDescription>
            </div>
            <Button onClick={handleAdd}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Volunteer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Tasks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {volunteers.map((volunteer) => (
                  <TableRow key={volunteer.id}>
                    <TableCell className="font-medium">{volunteer.name}</TableCell>
                    <TableCell>{volunteer.email}</TableCell>
                    <TableCell>{volunteer.location}</TableCell>
                    <TableCell>{volunteer.hours}</TableCell>
                    <TableCell>{volunteer.tasksCompleted}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddingVolunteer} onOpenChange={setIsAddingVolunteer}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Volunteer</DialogTitle>
            <DialogDescription>
              Enter the volunteer's information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter volunteer name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="volunteer@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter location"
              />
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setIsAddingVolunteer(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Add Volunteer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
