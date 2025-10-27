'use client';

import { useState } from "react";
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

export default function Home() {
  const [logoVisible, setLogoVisible] = useState(true);

  return (
    <AppShell title="RoadHog">
      <div 
        className="relative h-full w-full"
        onMouseEnter={() => setLogoVisible(false)}
        onTouchStart={() => setLogoVisible(false)}
      >
        <Map />

        <div 
          className={cn(
            "absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm transition-opacity duration-500",
            !logoVisible && "opacity-0 pointer-events-none"
          )}
        >
          <Logo className="w-32 h-32" />
          <p className="mt-4 text-lg font-semibold text-foreground">Hover or tap to begin</p>
        </div>
        
        <div className={cn("absolute inset-0 top-auto bg-gradient-to-t from-black/80 to-transparent p-8 text-center transition-opacity duration-500", !logoVisible && "opacity-0")}>
            <h1 className="text-4xl font-bold text-white">Let's get our next journey started!</h1>
        </div>

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
                  <TripPlannerCard />
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
