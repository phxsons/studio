"use client";

import { GoogleMap, useJsApiLoader, DirectionsRenderer } from "@react-google-maps/api";
import { useMemo } from "react";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertTriangle } from "lucide-react";

interface MapProps {
  directionsResponse: google.maps.DirectionsResult | null;
}

export default function Map({ directionsResponse }: MapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });

  const center = useMemo(() => ({
    lat: 39.8283,
    lng: -98.5795
  }), []);

  if (loadError) {
    return (
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
    )
  }

  if (!isLoaded) {
    return <Skeleton className="h-full w-full" />;
  }

  return (
    <GoogleMap
      mapContainerClassName="h-full w-full"
      center={center}
      zoom={4}
    >
      {directionsResponse && (
        <DirectionsRenderer directions={directionsResponse} />
      )}
    </GoogleMap>
  );
}
