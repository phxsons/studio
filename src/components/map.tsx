"use client";

import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useMemo } from "react";
import { Skeleton } from "./ui/skeleton";

export default function Map() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });

  const center = useMemo(() => ({
    lat: 39.8283,
    lng: -98.5795
  }), []);

  if (!isLoaded) {
    return <Skeleton className="h-full w-full" />;
  }

  return (
    <GoogleMap
      mapContainerClassName="h-full w-full"
      center={center}
      zoom={4}
    >
      {/* Child components, like markers, info windows, etc. */}
    </GoogleMap>
  );
}
