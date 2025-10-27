'use client';

import { useState, useEffect } from "react";
import AppShell from "@/components/app-shell";
import Map from "@/components/map";
import PoiCarousel from "@/components/dashboard/poi-carousel";
import UpcomingStopsCard from "@/components/dashboard/upcoming-stops-card";
import WeatherCard from "@/components/dashboard/weather-card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PanelRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import TripPlannerCard from "@/components/dashboard/trip-planner-card";
import { useJsApiLoader } from "@react-google-maps/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { suggestStopsAlongRoute, type SuggestedStop } from "@/ai/flows/suggest-stops-along-route";
import { userProfile } from "@/lib/data";

const libraries: ("places" | "maps")[] = ["places", "maps"];

type TripStep = 'initial' | 'add-stops' | 'summary' | 'driving';
export type StopType = 'gas' | 'event' | 'lodging';

export default function Home() {
  const [logoVisible, setLogoVisible] = useState(true);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [isRoutePlanning, setIsRoutePlanning] = useState(false);
  const [tripStep, setTripStep] = useState<TripStep>('initial');
  const [waypoints, setWaypoints] = useState<google.maps.DirectionsWaypoint[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestedStop[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });
  
  useEffect(() => {
    if (isLoaded && tripStep === 'initial') {
      // Get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const geocoder = new window.google.maps.Geocoder();
            const latLng = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            geocoder.geocode({ location: latLng }, (results, status) => {
              if (status === 'OK' && results && results[0]) {
                setOrigin(results[0].formatted_address);
              } else {
                console.error('Geocoder failed due to: ' + status);
              }
            });
          },
          (error) => {
            console.error(`Error getting user location: ${error.message} (code: ${error.code})`);
          }
        );
      }
    }
  }, [isLoaded, tripStep]);


  const handlePlanRoute = async (newWaypoints: google.maps.DirectionsWaypoint[] = waypoints) => {
    if (!origin || !destination) {
      return;
    }
    setIsRoutePlanning(true);
    setSuggestions([]);
    const directionsService = new google.maps.DirectionsService();
    try {
      const results = await directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: newWaypoints,
        optimizeWaypoints: true,
      });
      setDirectionsResponse(results);
      if (tripStep === 'initial') {
        setTripStep('add-stops');
        getSuggestions(newWaypoints);
      }
    } catch (e) {
      console.error("Directions request failed", e);
    } finally {
      setIsRoutePlanning(false);
    }
  };

  const getSuggestions = async (currentWaypoints: google.maps.DirectionsWaypoint[]) => {
    setIsSuggesting(true);
    try {
      const waypointStrings = currentWaypoints.map(wp => ('location' in wp && wp.location?.toString()) || '').filter(Boolean);
      const result = await suggestStopsAlongRoute({
        origin,
        destination,
        waypoints: waypointStrings,
        interests: userProfile.interests,
        vehicleDetails: userProfile.vehicle,
      });
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error("Failed to get suggestions:", error);
    } finally {
      setIsSuggesting(false);
    }
  };
  
  const handleInteraction = () => {
    if (logoVisible) {
      setLogoVisible(false);
    }
  };

  const handleAddStop = (stop: string, type: StopType) => {
    const newWaypoint = { location: stop, stopover: true };
    const newWaypoints = [...waypoints, newWaypoint];
    setWaypoints(newWaypoints);
    handlePlanRoute(newWaypoints);
  };
  
  const handleStartTrip = () => {
    setTripStep('driving');
    setLogoVisible(true);
    setTimeout(() => {
        const logoEl = document.getElementById('animated-logo');
        if (logoEl) {
            logoEl.classList.add('-translate-x-[200vw]', 'rotate-[-360deg]');
        }
    }, 100);
    setTimeout(() => setLogoVisible(false), 1500);
  };

  const handleResetTrip = () => {
    setOrigin('');
    setDestination('');
    setDirectionsResponse(null);
    setWaypoints([]);
    setSuggestions([]);
    setTripStep('initial');
  }

  const handleAddSuggestion = (suggestion: SuggestedStop) => {
    const stopString = `${suggestion.name}, ${suggestion.location}`;
    const newWaypoint = { location: stopString, stopover: true };
    const newWaypoints = [...waypoints, newWaypoint];
    setWaypoints(newWaypoints);
    // Remove the suggestion from the list
    setSuggestions(prev => prev.filter(s => s.name !== suggestion.name));
    handlePlanRoute(newWaypoints);
  }

  if (loadError) {
    return (
      <AppShell title="RoadHog">
        <div className="h-full w-full flex items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Google Maps Error</AlertTitle>
            <AlertDescription>
              <p>Could not load the map. This is likely due to an invalid or missing Google Maps API key.</p>
              <p className="mt-2">Please ensure you have a valid <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> set in your <code>.env</code> file and that the Maps JavaScript API is enabled in your Google Cloud project.</p>
            </AlertDescription>
          </Alert>
        </div>
      </AppShell>
    )
  }

  if (!isLoaded) {
    return (
      <AppShell title="RoadHog">
        <Skeleton className="h-full w-full" />
      </AppShell>
    );
  }

  return (
    <AppShell title="RoadHog">
      <div 
        className="relative h-full w-full"
        onMouseEnter={handleInteraction}
        onTouchStart={handleInteraction}
        onFocusCapture={handleInteraction}
      >
        <Map directionsResponse={directionsResponse} />

        <div 
          className={cn(
            "absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm transition-opacity duration-500",
            !logoVisible && "opacity-0 pointer-events-none",
            tripStep === 'driving' && "bg-transparent backdrop-blur-none"
          )}
        >
          <Logo id="animated-logo" className={cn(
            "w-32 h-32 transition-all duration-1000 ease-in-out",
            tripStep === 'driving' ? "opacity-100" : ""
          )} />
          <p className={cn(
            "mt-4 text-lg font-semibold text-foreground",
            tripStep === 'driving' && 'hidden'
            )}>Hover or tap to begin</p>
        </div>
        
        <div className={cn("absolute inset-0 top-auto bg-gradient-to-t from-black/80 to-transparent p-8 text-center transition-opacity duration-500", tripStep !== 'initial' || !logoVisible ? "opacity-0" : "")}>
            <h1 className="text-4xl font-bold text-white">Let's get our next journey started!</h1>
        </div>

        {tripStep !== 'driving' && (
           <div className="absolute top-4 left-4 z-10 w-full max-w-sm">
             <TripPlannerCard 
               origin={origin}
               destination={destination}
               onOriginChange={setOrigin}
               onDestinationChange={setDestination}
               onPlanRoute={() => handlePlanRoute()}
               isRoutePlanning={isRoutePlanning}
               tripStep={tripStep}
               onAddStop={handleAddStop}
               onConfirmStops={() => setTripStep('summary')}
               onStartTrip={handleStartTrip}
               onReset={handleResetTrip}
               waypoints={waypoints}
               onEditStops={() => setTripStep('add-stops')}
               suggestions={suggestions}
               onAddSuggestion={handleAddSuggestion}
               isSuggesting={isSuggesting}
             />
           </div>
        )}

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm">
              <PanelRight />
              <span className="sr-only">Toggle Details Panel</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle>Trip Details</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100%-4rem)]">
                <div className="space-y-6 p-4">
                  <WeatherCard />
                  <div>
                    <h2 className="text-xl font-bold tracking-tight mb-4">Points of Interest</h2>
                    <PoiCarousel />
                  </div>
                  <UpcomingStopsCard />
                </div>
              </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </AppShell>
  );
}
