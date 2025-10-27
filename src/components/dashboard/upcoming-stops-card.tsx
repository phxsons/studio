import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Stop } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";

interface UpcomingStopsCardProps {
    stops: Stop[];
    isLoading: boolean;
}

export default function UpcomingStopsCard({ stops, isLoading }: UpcomingStopsCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Stops</CardTitle>
          <CardDescription>Your personalized road trip itinerary.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Stops</CardTitle>
        <CardDescription>Your personalized road trip itinerary.</CardDescription>
      </CardHeader>
      <CardContent>
        {stops && stops.length > 0 ? (
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
        ) : (
            <p className="text-sm text-muted-foreground text-center">No upcoming stops in the current trip.</p>
        )}
      </CardContent>
    </Card>
  );
}
