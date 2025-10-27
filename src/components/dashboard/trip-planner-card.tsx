
'use client';

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Route, RotateCcw, Navigation, Sparkles, Wand2, MapPin, Calendar } from "lucide-react";
import { Autocomplete } from "@react-google-maps/api";
import { TripStep } from "@/app/page";
import type { RoadTripItineraryInput, RoadTripItineraryOutput } from "@/ai/flows/generate-personalized-road-trip-itinerary";
import TripPreferencesForm from "./trip-preferences-form";
import { ScrollArea } from "../ui/scroll-area";

interface TripPlannerCardProps {
  origin: string;
  onOriginChange: (value: string) => void;
  destination: string;
  onDestinationChange: (value: string) => void;
  onPlanRoute: (preferences?: Omit<RoadTripItineraryInput, 'startingPoint' | 'destination'>) => void;
  isRoutePlanning: boolean;
  tripStep: TripStep;
  onStartTrip: (useGoogleMaps: boolean) => void;
  onReset: () => void;
  itinerary: RoadTripItineraryOutput | null;
  onBackToPreferences: () => void;
  onProceedToPreferences: () => void;
}

export default function TripPlannerCard({
  origin,
  onOriginChange,
  destination,
  onDestinationChange,
  onPlanRoute,
  isRoutePlanning,
  tripStep,
  onStartTrip,
  onReset,
  itinerary,
  onBackToPreferences,
  onProceedToPreferences,
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
  
  const handleInitialPlan = (e: React.FormEvent) => {
    e.preventDefault();
    onPlanRoute();
  };

  const handlePreferencesSubmit = (preferences: Omit<RoadTripItineraryInput, 'startingPoint' | 'destination'>) => {
    onPlanRoute(preferences);
  };
  
  return (
    <Card>
      <form onSubmit={handleInitialPlan}>
        <CardHeader>
          <CardTitle>Trip Planner</CardTitle>
          {tripStep === 'initial' && <CardDescription>Enter your destination to map your journey.</CardDescription>}
          {tripStep === 'startPointChoice' && <CardDescription>How are you planning to travel?</CardDescription>}
          {tripStep === 'preferences' && <CardDescription>Customize your trip to get AI-powered recommendations.</CardDescription>}
          {tripStep === 'generating' && <CardDescription>Our AI is crafting your personalized itinerary...</CardDescription>}
          {tripStep === 'summary' && <CardDescription>Your AI-generated road trip is ready!</CardDescription>}
        </CardHeader>
        <CardContent className="grid gap-4">
          
          {(tripStep === 'initial' || tripStep === 'preferences' || tripStep === 'startPointChoice') && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="start-point">Starting Point</Label>
                <Autocomplete
                  onLoad={(ref) => originAutocompleteRef.current = ref}
                  onPlaceChanged={handleOriginPlaceChanged}
                  isEnabled={tripStep === 'startPointChoice'}
                >
                  <Input
                    id="start-point"
                    value={origin}
                    onChange={(e) => onOriginChange(e.target.value)}
                    readOnly={tripStep !== 'startPointChoice'}
                    className={tripStep !== 'startPointChoice' ? "bg-muted" : ""}
                  />
                </Autocomplete>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="destination">Destination</Label>
                <Autocomplete
                  onLoad={(ref) => destinationAutocompleteRef.current = ref}
                  onPlaceChanged={handleDestinationPlaceChanged}
                  isEnabled={tripStep === 'initial'}
                >
                  <Input
                    id="destination"
                    placeholder="e.g., San Francisco, CA"
                    value={destination}
                    onChange={(e) => onDestinationChange(e.target.value)}
                    readOnly={tripStep !== 'initial'}
                    className={tripStep !== 'initial' ? "bg-muted" : ""}
                  />
                </Autocomplete>
              </div>
            </>
          )}

          {tripStep === 'initial' && (
            <Button type="submit" disabled={isRoutePlanning || !destination}>
              {isRoutePlanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Route className="mr-2 h-4 w-4" />}
              {isRoutePlanning ? 'Validating...' : 'Plan Route'}
            </Button>
          )}

          {tripStep === 'startPointChoice' && (
            <div className="grid sm:grid-cols-2 gap-2">
                <Button onClick={onProceedToPreferences} variant="outline">
                    <MapPin className="mr-2 h-4 w-4" /> Let's Go Now
                </Button>
                <Button onClick={onProceedToPreferences} variant="outline">
                    <Calendar className="mr-2 h-4 w-4" /> Plan for Later
                </Button>
            </div>
          )}

          {tripStep === 'preferences' && (
            <div>
              <div className="flex items-center gap-4 my-4">
                  <Button onClick={() => onStartTrip(true)} className="w-full" variant="outline">
                      <Navigation className="mr-2 h-4 w-4" /> Just Navigate
                  </Button>
                  <p className="text-sm text-muted-foreground">OR</p>
              </div>
              <TripPreferencesForm onSubmit={handlePreferencesSubmit} isSubmitting={isRoutePlanning} />
            </div>
          )}

          {tripStep === 'generating' && (
             <div className="flex flex-col items-center justify-center text-center space-y-4 h-64">
                <Loader2 className="h-16 w-16 text-primary animate-spin" />
                <p className="font-bold text-xl">We're Going Hog Wild</p>
             </div>
          )}

          {tripStep === 'summary' && itinerary && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Your Itinerary:</h3>
                <ScrollArea className="h-64">
                  <ul className="space-y-4 pr-4">
                      {itinerary.itinerary.map((stop, index) => (
                          <li key={index} className="pb-4 border-b last:border-b-0">
                            <p className="font-semibold">{stop.name}</p>
                            <p className="text-sm text-muted-foreground">{stop.location}</p>
                            <p className="text-sm mt-1">{stop.activity}</p>
                          </li>
                      ))}
                  </ul>
                </ScrollArea>
              </div>
          )}
        </CardContent>

        {tripStep === 'summary' && (
          <CardFooter className="flex-col sm:flex-row gap-2">
            <Button onClick={() => onStartTrip(false)} className="w-full">
              <Navigation className="mr-2 h-4 w-4" />
              Start Guided Trip
            </Button>
             <Button onClick={onBackToPreferences} variant="outline" className="w-full">
              <Wand2 className="mr-2 h-4 w-4" />
              Customize
            </Button>
          </CardFooter>
        )}

        {tripStep !== 'initial' && tripStep !== 'generating' && (
          <CardFooter>
            <Button onClick={onReset} variant="ghost" className="w-full text-muted-foreground">
              <RotateCcw className="mr-2 h-4 w-4" />
              Start Over
            </Button>
          </CardFooter>
        )}
      </form>
    </Card>
  );
}
