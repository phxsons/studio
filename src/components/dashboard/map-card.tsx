import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Map from "@/components/map";

interface MapCardProps {
    className?: string;
    directionsResponse: google.maps.DirectionsResult | null;
}

export default function MapCard({ className, directionsResponse }: MapCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle>Current Route</CardTitle>
      </CardHeader>
      <CardContent className="p-0 aspect-video">
        <Map directionsResponse={directionsResponse} />
      </CardContent>
    </Card>
  );
}
