import AppShell from "@/components/app-shell";
import MapCard from "@/components/dashboard/map-card";
import PoiCarousel from "@/components/dashboard/poi-carousel";
import UpcomingStopsCard from "@/components/dashboard/upcoming-stops-card";
import WeatherCard from "@/components/dashboard/weather-card";

export default function Home() {
  return (
    <AppShell title="RoadHog Radar">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 p-4 md:p-6">
        <div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
          <h1 className="text-2xl font-bold tracking-tight">RoadHog Radar</h1>
          <p className="text-muted-foreground">Your real-time travel dashboard.</p>
        </div>
        
        <MapCard className="lg:col-span-2 xl:col-span-3" />
        <WeatherCard />
        
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
