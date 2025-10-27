
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
  
  const renderContent = () => {
    switch (tripStep) {
      case 'initial':
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="start-point">Starting Point</Label>
              <Autocomplete
                onLoad={(ref) => originAutocompleteRef.current = ref}
                onPlaceChanged={handleOriginPlaceChanged}
                isEnabled={false}
              >
                <Input
                  id="start-point"
                  value={origin}
                  onChange={(e) => onOriginChange(e.target.value)}
                  readOnly
                  className="bg-muted"
                />
              </Autocomplete>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="destination">Destination</Label>
              <Autocomplete
                onLoad={(ref) => destinationAutocompleteRef.current = ref}
                onPlaceChanged={handleDestinationPlaceChanged}
                isEnabled={true}
              >
                <Input
                  id="destination"
                  placeholder="e.g., San Francisco, CA"
                  value={destination}
                  onChange={(e) => onDestinationChange(e.target.value)}
                />
              </Autocomplete>
            </div>
            <Button type="submit" disabled={isRoutePlanning || !destination}>
              {isRoutePlanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Route className="mr-2 h-4 w-4" />}
              {isRoutePlanning ? 'Validating...' : 'Plan Route'}
            </Button>
          </>
        );

      case 'startPointChoice':
         return (
           <>
              <div className="grid gap-2">
                <Label htmlFor="start-point">Starting Point</Label>
                <Input id="start-point" value={origin} readOnly className="bg-muted" />
              </div>
               <div className="grid gap-2">
                <Label htmlFor="destination">Destination</Label>
                <Input id="destination" value={destination} readOnly className="bg-muted" />
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                  <Button onClick={onProceedToPreferences}>
                      <MapPin className="mr-2 h-4 w-4" /> Let's Go Now
                  </Button>
                  <Button onClick={onProceedToPreferences} variant="outline">
                      <Calendar className="mr-2 h-4 w-4" /> Plan for Later
                  </Button>
              </div>
           </>
        );

      case 'preferences':
        return (
            <>
              <div className="grid gap-2">
                <Label htmlFor="start-point">Starting Point</Label>
                 <Autocomplete
                  onLoad={(ref) => originAutocompleteRef.current = ref}
                  onPlaceChanged={handleOriginPlaceChanged}
                  isEnabled={true}
                >
                  <Input
                    id="start-point"
                    value={origin}
                    onChange={(e) => onOriginChange(e.target.value)}
                  />
                </Autocomplete>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="destination">Destination</Label>
                <Input id="destination" value={destination} readOnly className="bg-muted" />
              </div>
               <div>
                <div className="flex items-center gap-4 my-4">
                    <Button onClick={() => onStartTrip(true)} className="w-full" variant="outline">
                        <Navigation className="mr-2 h-4 w-4" /> Just Navigate
                    </Button>
                    <p className="text-sm text-muted-foreground">OR</p>
                </div>
                <TripPreferencesForm onSubmit={handlePreferencesSubmit} isSubmitting={isRoutePlanning} />
              </div>
            </>
        );
      
      case 'generating':
        return (
          <div className="flex flex-col items-center justify-center text-center space-y-4 h-64">
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
              <p className="font-bold text-xl">We're Going Hog Wild</p>
          </div>
        );

      case 'summary':
        return itinerary && (
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
        );
      
      default:
        return null;
    }
  };

  const getCardDescription = () => {
     switch (tripStep) {
        case 'initial': return "Enter your destination to map your journey.";
        case 'startPointChoice': return "How are you planning to travel?";
        case 'preferences': return "Customize your trip to get AI-powered recommendations.";
        case 'generating': return "Our AI is crafting your personalized itinerary...";
        case 'summary': return "Your AI-generated road trip is ready!";
        default: return "";
     }
  }


  return (
    <Card>
      <form onSubmit={handleInitialPlan}>
        <CardHeader>
          <CardTitle>Trip Planner</CardTitle>
          <CardDescription>{getCardDescription()}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {renderContent()}
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

    