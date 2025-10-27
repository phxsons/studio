"use client";

import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api";
import { useMemo } from "react";

interface MapProps {
  directionsResponse: google.maps.DirectionsResult | null;
}

export default function Map({ directionsResponse }: MapProps) {
  const center = useMemo(() => ({
    lat: 39.8283,
    lng: -98.5795
  }), []);

  return (
    <GoogleMap
      mapContainerClassName="h-full w-full"
      center={center}
      zoom={4}
    >
      {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
    </GoogleMap>
  );
}
