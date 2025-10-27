import AppShell from "@/components/app-shell";
import MapCard from "@/components/dashboard/map-card";
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
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1694580511925-bfca6bb34020?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxtYXAlMjByb3V0ZXxlbnwwfHx8fDE3NjE0NjUwMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080')" }}
        >
          <div className="flex h-full w-full flex-col items-center justify-center bg-black/50">
            <h1 className="text-4xl font-bold text-white">Let's get our next journey started!</h1>
          </div>
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
