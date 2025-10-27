import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { stops } from "@/lib/data";

export default function UpcomingStopsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Stops</CardTitle>
        <CardDescription>Your personalized road trip itinerary.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {stops.map((stop) => (
            <li key={stop.id} className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary p-2 rounded-lg">
                <stop.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold">{stop.name}</p>
                <p className="text-sm text-muted-foreground">{stop.location}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
