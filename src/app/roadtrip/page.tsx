'use client';

import { useState, useEffect } from 'react';
import AppShell from "@/components/app-shell";
import MapCard from "@/components/dashboard/map-card";
import UpcomingStopsCard from "@/components/dashboard/upcoming-stops-card";
import RouteWeatherCard from "@/components/dashboard/route-weather-card";
import TrafficAlertsCard from "@/components/dashboard/traffic-alerts-card";
import { getWeatherForRoute, type WeatherInfo } from "@/ai/flows/get-weather-for-route";
import { getTrafficForRoute, type TrafficAlert } from "@/ai/flows/get-traffic-for-route";
import { useJsApiLoader } from '@react-google-maps/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import type { Stop } from '@/lib/types';
import { Mountain, Tent, Music, Utensils } from 'lucide-react';
import SuggestedDestinationsCard from '@/components/dashboard/suggested-destinations-card';
import { suggestDestinations, type SuggestedDestination } from '@/ai/flows/suggest-destinations';

const libraries: ('places' | 'maps')[] = ['places', 'maps'];

const stopIcons = [Mountain, Tent, Music, Utensils];

export default function RoadtripPage() {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [traffic, setTraffic] = useState<TrafficAlert[] | null>(null);
  const [suggestedDestinations, setSuggestedDestinations] = useState<SuggestedDestination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  useEffect(() => {
    if (!isLoaded) return;

    const getRouteExtras = async () => {
      // Intentionally disabled as per user request
      setIsLoading(false);
    };

    getRouteExtras();
  }, [isLoaded]);
  
  if (loadError) {
    return (
      <AppShell title="RoadHog Radar">
        <div className="h-full w-full flex items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Google Maps Error</AlertTitle>
            <AlertDescription>
              <p>Could not load the map. This is likely due to an invalid or missing Google Maps API key.</p>
            </AlertDescription>
          </Alert>
        </div>
      </AppShell>
    )
  }


  return (
    <AppShell title="RoadHog Radar">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 p-4 md:p-6">
        <div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
          <h1 className="text-2xl font-bold tracking-tight">RoadHog Radar</h1>
          <p className="text-muted-foreground">Your real-time travel dashboard.</p>
        </div>
        
        {isLoaded && !isLoading ? (
          <MapCard 
            className="lg:col-span-2 xl:col-span-3" 
            directionsResponse={directionsResponse} 
          />
        ) : (
          <Card className="lg:col-span-2 xl:col-span-3">
             <CardHeader>
                <CardTitle>Current Route</CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[400px] w-full" />
              </CardContent>
          </Card>
        )}

        <div className="space-y-4 md:space-y-6">
            <RouteWeatherCard weather={weather} isLoading={isLoading} />
            <TrafficAlertsCard alerts={traffic} isLoading={isLoading} />
        </div>
        
        <div className="md:col-span-2 lg:col-span-4">
          <SuggestedDestinationsCard destinations={suggestedDestinations} isLoading={isLoading} />
        </div>

        <div className="md:col-span-2 lg:col-span-4">
           <UpcomingStopsCard stops={stops} isLoading={isLoading} />
        </div>
      </div>
    </AppShell>
  );
}
