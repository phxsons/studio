import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { weatherAlerts } from "@/lib/data";

export default function WeatherCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {weatherAlerts.length > 0 ? (
          weatherAlerts.map((alert, index) => (
            <div key={alert.id}>
              <div className="flex items-start gap-4">
                <div className="text-accent">
                  <alert.icon className="w-8 h-8"/>
                </div>
                <div>
                  <p className="font-semibold">{alert.title}</p>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                </div>
              </div>
              {index < weatherAlerts.length - 1 && <Separator className="mt-4" />}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No weather alerts for your route.</p>
        )}
      </CardContent>
    </Card>
  );
}
