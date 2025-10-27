'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Route } from "lucide-react";

export default function TripPlannerCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trip Planner</CardTitle>
        <CardDescription>Enter your start and end points to map your journey.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start-point">Starting Point</Label>
              <Input id="start-point" placeholder="e.g., Denver, CO" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="destination">Destination</Label>
              <Input id="destination" placeholder="e.g., San Francisco, CA" />
            </div>
            <Button type="submit">
              <Route className="mr-2 h-4 w-4" />
              Plan Route
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
