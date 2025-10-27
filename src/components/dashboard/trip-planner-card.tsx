'use client';

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Route, Fuel, Calendar, Hotel, Edit2, Rocket, RotateCcw, Sparkles, PlusCircle, Navigation } from "lucide-react";
import { Autocomplete } from "@react-google-maps/api";
import { Separator } from "../ui/separator";
import type { StopType, TripStep } from "@/app/page";
import type { SuggestedStop } from "@/ai/flows/suggest-stops-along-route";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";

interface TripPlannerCardProps {
  origin: string;
  destination: string;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onPlanRoute: () => void;
  isRoutePlanning: boolean;
  tripStep: TripStep;
  onAddStop: (stop: string, type: StopType) => void;
  onConfirmStops: () => void;
  onStartTrip: () => void;
  onReset: () => void;
  waypoints: google.maps.DirectionsWaypoint[];
  onEditStops: () => void;
  suggestions: SuggestedStop[];
  onAddSuggestion: (suggestion: SuggestedStop) => void;
  isSuggesting: boolean;
}

const StopInput = ({ type, onAdd }: { type: StopType; onAdd: (stop: string, type: StopType) => void }) => {
  const [value, setValue] = useState('');
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const icons = {
    gas: <Fuel className="mr-2 h-4 w-4" />,
    event: <Calendar className="mr-2 h-4 w-4" />,
    lodging: <Hotel className="mr-2 h-4 w-4" />,
  };

  const placeholders = {
    gas: "e.g., Gas station in Omaha, NE",
    event: "e.g., Concert in Chicago, IL",
    lodging: "e.g., Hotel in Cleveland, OH",
  };

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      setValue(place.formatted_address || place.name || "");
    }
  };

  const handleAddClick = () => {
    if (value) {
      onAdd(value, type);
      setValue('');
    }
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor={`stop-${type}`} className="flex items-center">
        {icons[type]} Add {type} stop
      </Label>
      <div className="flex gap-2">
        <Autocomplete
          onLoad={(ref) => (autocompleteRef.current = ref)}
          onPlaceChanged={handlePlaceChanged}
        >
          <Input
            id={`stop-${type}`}
            placeholder={placeholders[type]}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </Autocomplete>
        <Button type="button" variant="secondary" onClick={handleAddClick}>Add</Button>
      </div>
    </div>
  );
};

const Suggestions = ({ suggestions, onAdd, isSuggesting }: { suggestions: SuggestedStop[], onAdd: (suggestion: SuggestedStop) => void, isSuggesting: boolean }) => {
  if (isSuggesting) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    )
  }

  if (suggestions.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-4">No suggestions at this time.</p>;
  }

  return (
    <ScrollArea className="h-48">
      <div className="space-y-2 pr-4">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="p-2 border rounded-lg bg-background/50 text-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{suggestion.name}</p>
                <p className="text-muted-foreground text-xs">{suggestion.location}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => onAdd(suggestion)} title={`Add ${suggestion.name} to trip`}>
                <PlusCircle className="w-4 h-4" />
              </Button>
            </div>
            <p className="mt-1 text-muted-foreground">{suggestion.description}</p>
            <Badge variant="outline" className="mt-2 capitalize">{suggestion.type}</Badge>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

export default function TripPlannerCard({
  origin,
  destination,
  onOriginChange,
  onDestinationChange,
  onPlanRoute,
  isRoutePlanning,
  tripStep,
  onAddStop,
  onConfirmStops,
  onStartTrip,
  onReset,
  waypoints,
  onEditStops,
  suggestions,
  onAddSuggestion,
  isSuggesting,
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

  const handleNavigate = () => {
    if (!origin || !destination) return;

    const googleMapsUrl = new URL("https://www.google.com/maps/dir/");
    googleMapsUrl.searchParams.append("api", "1");
    googleMapsUrl.searchParams.append("origin", origin);
    googleMapsUrl.searchParams.append("destination", destination);

    const waypointStrings = waypoints
      .map(wp => ('location' in wp && wp.location?.toString()) || '')
      .filter(Boolean);
    
    if (waypointStrings.length > 0) {
      googleMapsUrl.searchParams.append("waypoints", waypointStrings.join('|'));
    }

    window.open(googleMapsUrl.toString(), '_blank');
    onStartTrip();
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Trip Planner</CardTitle>
        {tripStep === 'initial' && <CardDescription>Enter your start and end points to map your journey.</CardDescription>}
        {tripStep === 'add-stops' && <CardDescription>Add stops or see AI-powered suggestions for your route.</CardDescription>}
        {tripStep === 'summary' && <CardDescription>Here is your trip summary. Ready to hit the road?</CardDescription>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="start-point">Starting Point</Label>
            <Autocomplete
              onLoad={(ref) => originAutocompleteRef.current = ref}
              onPlaceChanged={handleOriginPlaceChanged}
              isEnabled={tripStep === 'initial'}
            >
              <Input 
                id="start-point" 
                placeholder="e.g., Denver, CO" 
                value={origin}
                onChange={(e) => onOriginChange(e.target.value)}
                readOnly={tripStep !== 'initial'}
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
              />
            </Autocomplete>
          </div>
          
          {tripStep === 'initial' && (
            <Button type="submit" disabled={isRoutePlanning}>
              {isRoutePlanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Route className="mr-2 h-4 w-4" />}
              {isRoutePlanning ? 'Calculating...' : 'Plan Route'}
            </Button>
          )}
        </form>

        {tripStep === 'add-stops' && (
          <div className="grid gap-4 mt-4">
            <Separator />
             <div className="space-y-1">
                <h3 className="font-semibold flex items-center gap-2"><Sparkles className="text-accent" /> AI Suggestions</h3>
                <p className="text-sm text-muted-foreground">Stops recommended just for you.</p>
            </div>
            <Suggestions suggestions={suggestions} onAdd={onAddSuggestion} isSuggesting={isSuggesting} />
            <Separator />
            <div className="space-y-1">
                <h3 className="font-semibold">Add Manual Stops</h3>
                <p className="text-sm text-muted-foreground">Know exactly where you want to go?</p>
            </div>
            <StopInput type="gas" onAdd={onAddStop} />
            <StopInput type="event" onAdd={onAddStop} />
            <StopInput type="lodging" onAdd={onAddStop} />
          </div>
        )}

        {tripStep === 'summary' && (
            <div className="mt-4 space-y-2">
                <h3 className="font-semibold">Your Stops:</h3>
                {waypoints.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {waypoints.map((wp, index) => (
                            <li key={index}>{'location' in wp && wp.location?.toString()}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground">No stops added.</p>
                )}
            </div>
        )}

      </CardContent>

      {tripStep === 'add-stops' && (
        <CardFooter>
          <Button onClick={onConfirmStops} className="w-full">Confirm Stops</Button>
        </CardFooter>
      )}

      {tripStep === 'summary' && (
        <CardFooter className="flex-col sm:flex-row gap-2">
          <Button onClick={handleNavigate} className="w-full">
            <Navigation className="mr-2 h-4 w-4"/>
            Navigate
          </Button>
          <Button onClick={onEditStops} variant="outline" className="w-full">
            <Edit2 className="mr-2 h-4 w-4"/>
            Change
          </Button>
        </CardFooter>
      )}

      {tripStep !== 'initial' && (
          <CardFooter>
            <Button onClick={onReset} variant="ghost" className="w-full text-muted-foreground">
              <RotateCcw className="mr-2 h-4 w-4" />
              Start Over
            </Button>
          </CardFooter>
      )}
    </Card>
  );
}
