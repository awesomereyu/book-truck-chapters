import { format, parseISO, startOfDay, isAfter, isEqual } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSchedule, ScheduleEvent } from "@/lib/localStorage";
import { Calendar, Clock, MapPin, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

// Get current date in EST timezone
const getESTDate = () => {
  const now = new Date();
  const estString = now.toLocaleString("en-US", { timeZone: "America/New_York" });
  return startOfDay(new Date(estString));
};

export const ScheduleCard = () => {
  const [schedule, setSchedule] = useState<ScheduleEvent[]>([]);

  useEffect(() => {
    const allEvents = getSchedule();
    const todayEST = getESTDate();
    
    // Filter to only show today and future dates
    const upcomingEvents = allEvents.filter((event) => {
      const eventDate = startOfDay(parseISO(event.date));
      return isAfter(eventDate, todayEST) || isEqual(eventDate, todayEST);
    });
    
    setSchedule(upcomingEvents);
  }, []);

  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Book Truck Schedule
        </CardTitle>
        <CardDescription>Find out where we'll be next!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {schedule.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              No upcoming book truck events are scheduled. Please check back soon!
            </p>
          ) : (
            schedule.map((event) => (
              <div
                key={event.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border ${
                  event.isClosed ? "bg-muted/50 border-muted" : "bg-card border-border"
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">
                      {format(parseISO(event.date), "EEEE, MMMM d")}
                    </span>
                    {event.isClosed && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        Closed
                      </Badge>
                    )}
                  </div>
                  
                  {!event.isClosed ? (
                    <>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground italic">
                      {event.location}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
