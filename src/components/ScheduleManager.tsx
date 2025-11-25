import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getSchedule, updateScheduleEvent, ScheduleEvent, setSchedule } from "@/lib/localStorage";
import { Calendar, Clock, Edit, MapPin, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

export const ScheduleManager = () => {
  const [schedule, setScheduleState] = useState<ScheduleEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [addingEvent, setAddingEvent] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    location: "",
    startTime: "",
    endTime: "",
    isClosed: false,
  });

  useEffect(() => {
    setScheduleState(getSchedule());
  }, []);

  const handleEdit = (event: ScheduleEvent) => {
    setEditingEvent(event);
    setFormData({
      date: event.date,
      location: event.location,
      startTime: event.startTime,
      endTime: event.endTime,
      isClosed: event.isClosed,
    });
  };

  const handleSave = () => {
    if (editingEvent) {
      const updatedEvent: ScheduleEvent = {
        ...editingEvent,
        ...formData,
      };
      updateScheduleEvent(updatedEvent);
      const updatedSchedule = schedule.map(e => 
        e.id === editingEvent.id ? updatedEvent : e
      );
      setScheduleState(updatedSchedule);
      toast.success("Schedule updated successfully");
      setEditingEvent(null);
    }
  };

  const handleAdd = () => {
    if (!formData.date || !formData.location) {
      toast.error("Please enter date and location");
      return;
    }

    const newEvent: ScheduleEvent = {
      id: Date.now().toString(),
      ...formData,
    };

    const updatedSchedule = [...schedule, newEvent].sort((a, b) => 
      a.date.localeCompare(b.date)
    );
    setSchedule(updatedSchedule);
    setScheduleState(updatedSchedule);
    toast.success("Event added successfully");
    setAddingEvent(false);
    setFormData({
      date: "",
      location: "",
      startTime: "",
      endTime: "",
      isClosed: false,
    });
  };

  const handleOpenAdd = () => {
    setFormData({
      date: "",
      location: "",
      startTime: "16:00",
      endTime: "20:00",
      isClosed: false,
    });
    setAddingEvent(true);
  };

  const handleDelete = (id: string) => {
    const updatedSchedule = schedule.filter(e => e.id !== id);
    setSchedule(updatedSchedule);
    setScheduleState(updatedSchedule);
    toast.success("Event deleted");
  };

  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Schedule Management
              </CardTitle>
              <CardDescription>Manage book truck locations and hours</CardDescription>
            </div>
            <Button onClick={handleOpenAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">
                      {format(parseISO(event.date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>
                      {event.isClosed ? (
                        <span className="text-muted-foreground italic">Closed</span>
                      ) : (
                        `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`
                      )}
                    </TableCell>
                    <TableCell>
                      {event.isClosed ? (
                        <span className="text-destructive">Closed</span>
                      ) : (
                        <span className="text-green-600">Open</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(event)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(event.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Schedule Event</DialogTitle>
            <DialogDescription>
              Update the book truck schedule details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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

            <div className="flex items-center space-x-2">
              <Switch
                id="closed"
                checked={formData.isClosed}
                onCheckedChange={(checked) => setFormData({ ...formData, isClosed: checked })}
              />
              <Label htmlFor="closed">Closed on this day</Label>
            </div>

            {!formData.isClosed && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setEditingEvent(null)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Event Dialog */}
      <Dialog open={addingEvent} onOpenChange={setAddingEvent}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Schedule Event</DialogTitle>
            <DialogDescription>
              Add a new book truck schedule entry
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-date">Date</Label>
              <Input
                id="add-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-location">Location</Label>
              <Input
                id="add-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter location"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="add-closed"
                checked={formData.isClosed}
                onCheckedChange={(checked) => setFormData({ ...formData, isClosed: checked })}
              />
              <Label htmlFor="add-closed">Closed on this day</Label>
            </div>

            {!formData.isClosed && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="add-startTime">Start Time</Label>
                    <Input
                      id="add-startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="add-endTime">End Time</Label>
                    <Input
                      id="add-endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => {
                setAddingEvent(false);
                setFormData({
                  date: "",
                  location: "",
                  startTime: "",
                  endTime: "",
                  isClosed: false,
                });
              }}>
                Cancel
              </Button>
              <Button onClick={handleAdd}>
                Add Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
