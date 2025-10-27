import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { placeholderImages } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function MapCard({ className }: { className?: string }) {
  const mapImage = placeholderImages.find(p => p.id === 'map-route');

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle>Current Route</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {mapImage && (
          <div className="relative aspect-video w-full">
            <Image
              src={mapImage.imageUrl}
              alt={mapImage.description}
              fill
              className="object-cover"
              data-ai-hint={mapImage.imageHint}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
