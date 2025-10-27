import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PointOfInterest } from "@/lib/types";

export default function PoiCard({ poi }: { poi: PointOfInterest }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative aspect-video">
        <Image
          src={poi.image.src}
          alt={poi.title}
          fill
          className="object-cover"
          data-ai-hint={poi.image.hint}
        />
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="font-bold text-lg leading-tight">{poi.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{poi.description}</p>
        </div>
        <div className="mt-4">
          <Badge variant="secondary">{poi.category}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
