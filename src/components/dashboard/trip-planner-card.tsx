'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Route } from "lucide-react";

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
              <Input 
                id="start-point" 
                placeholder="e.g., Denver, CO" 
                value={origin}
                onChange={(e) => onOriginChange(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="destination">Destination</Label>
              <Input 
                id="destination" 
                placeholder="e.g., San Francisco, CA" 
                value={destination}
                onChange={(e) => onDestinationChange(e.target.value)}
              />
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
