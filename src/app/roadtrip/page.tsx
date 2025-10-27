'use client';

import { useState, useEffect } from 'react';
import AppShell from "@/components/app-shell";
import MapCard from "@/components/dashboard/map-card";
import PoiCarousel from "@/components/dashboard/poi-carousel";
import UpcomingStopsCard from "@/components/dashboard/upcoming-stops-card";
import RouteWeatherCard from "@/components/dashboard/route-weather-card";
import TrafficAlertsCard from "@/components/dashboard/traffic-alerts-card";
import { getWeatherForRoute, type WeatherInfo } from "@/ai/flows/get-weather-for-route";
import { getTrafficForRoute, type TrafficAlert } from "@/ai/flows/get-traffic-for-route";

export default function RoadtripPage() {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [traffic, setTraffic] = useState<TrafficAlert[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getRouteExtras = async () => {
      setIsLoading(true);
      // Simulate a route for demo purposes
      const demoRoute = {
        origin: "Denver, CO",
        destination: "San Francisco, CA",
        waypoints: ["Moab, UT", "Las Vegas, NV"],
      };

      try {
        const [weatherResponse, trafficResponse] = await Promise.all([
          getWeatherForRoute(demoRoute),
          getTrafficForRoute(demoRoute)
        ]);
        setWeather(weatherResponse);
        setTraffic(trafficResponse.alerts);
      } catch (error) {
        console.error("Failed to get weather or traffic data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getRouteExtras();
  }, []);

  return (
    <AppShell title="RoadHog Radar">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 p-4 md:p-6">
        <div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
          <h1 className="text-2xl font-bold tracking-tight">RoadHog Radar</h1>
          <p className="text-muted-foreground">Your real-time travel dashboard.</p>
        </div>
        
        <MapCard className="lg:col-span-2 xl:col-span-3" />

        <div className="space-y-4 md:space-y-6">
            <RouteWeatherCard weather={weather} isLoading={isLoading} />
            <TrafficAlertsCard alerts={traffic} isLoading={isLoading} />
        </div>
        
        <div className="md:col-span-2 lg:col-span-4">
          <h2 className="text-xl font-bold tracking-tight mb-4">Interest-Based Discovery</h2>
          <PoiCarousel />
        </div>

        <div className="md:col-span-2 lg:col-span-4">
           <UpcomingStopsCard />
        </div>
      </div>
    </AppShell>
  );
}
