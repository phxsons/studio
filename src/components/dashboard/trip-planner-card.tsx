'use client';

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Route } from "lucide-react";
import { Autocomplete } from "@react-google-maps/api";

interface TripPlannerCardProps {
  origin: string;
  destination: string;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onPlanRoute: () => void;
  isRoutePlanning: boolean;
}

export default function TripPlannerCard({
  origin,
  destination,
  onOriginChange,
  onDestinationChange,
  onPlanRoute,
  isRoutePlanning,
}: TripPlannerCardProps) {
  const originAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const destinationAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handleOriginPlaceChanged = () => {
    if (originAutocompleteRef.current) {
      const place = originAutocompleteRef.current.getPlace();
      onOriginChange(place.formatted_address || place.name || "");
    }
  };
  
  const handleDestinationPlaceChanged = () => {
    if (destinationAutocompleteRef.current) {
      const place = destinationAutocompleteRef.current.getPlace();
      onDestinationChange(place.formatted_address || place.name || "");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlanRoute();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trip Planner</CardTitle>
        <CardDescription>Enter your start and end points to map your journey.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start-point">Starting Point</Label>
              <Autocomplete
                onLoad={(ref) => originAutocompleteRef.current = ref}
                onPlaceChanged={handleOriginPlaceChanged}
              >
                <Input 
                  id="start-point" 
                  placeholder="e.g., Denver, CO" 
                  value={origin}
                  onChange={(e) => onOriginChange(e.target.value)}
                />
              </Autocomplete>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="destination">Destination</Label>
              <Autocomplete
                onLoad={(ref) => destinationAutocompleteRef.current = ref}
                onPlaceChanged={handleDestinationPlaceChanged}
              >
                <Input 
                  id="destination" 
                  placeholder="e.g., San Francisco, CA" 
                  value={destination}
                  onChange={(e) => onDestinationChange(e.target.value)}
                />
              </Autocomplete>
            </div>
            <Button type="submit" disabled={isRoutePlanning}>
              {isRoutePlanning ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Route className="mr-2 h-4 w-4" />
              )}
              {isRoutePlanning ? 'Calculating...' : 'Plan Route'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
