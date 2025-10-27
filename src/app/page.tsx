import AppShell from "@/components/app-shell";
import Map from "@/components/map";
import PoiCarousel from "@/components/dashboard/poi-carousel";
import UpcomingStopsCard from "@/components/dashboard/upcoming-stops-card";
import WeatherCard from "@/components/dashboard/weather-card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PanelRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  return (
    <AppShell title="RoadHog">
      <div className="relative h-full w-full">
        <Map />
        <div className="absolute inset-0 top-auto bg-gradient-to-t from-black/80 to-transparent p-8 text-center">
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
