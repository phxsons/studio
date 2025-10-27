'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { WeatherInfo } from "@/ai/flows/get-weather-for-route";
import { Sun, Cloudy, Wind, CloudRain, Snowflake, Zap, AlertTriangle, LucideProps } from 'lucide-react';
import { Separator } from "../ui/separator";
import { ComponentType } from "react";

interface RouteWeatherCardProps {
    weather: WeatherInfo | null;
    isLoading: boolean;
}

const iconMap: { [key: string]: ComponentType<LucideProps> } = {
    Sun: Sun,
    Cloudy: Cloudy,
    Wind: Wind,
    CloudRain: CloudRain,
    Snow: Snowflake,
    Zap: Zap,
    AlertTriangle: AlertTriangle,
};

export default function RouteWeatherCard({ weather, isLoading }: RouteWeatherCardProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (!weather) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Route Weather</CardTitle>
                <CardDescription>{weather.overallSummary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {weather.conditions.map((condition, index) => {
                    const Icon = iconMap[condition.icon] || AlertTriangle;
                    return (
                        <div key={index}>
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <Icon className="w-8 h-8 text-accent" />
                                    <div>
                                        <p className="font-semibold">{condition.location}</p>
                                        <p className="text-sm text-muted-foreground">{condition.condition}</p>
                                    </div>
                                </div>
                                <p className="font-bold text-lg">{condition.temperature}°F</p>
                            </div>
                             {index < weather.conditions.length - 1 && <Separator className="mt-4" />}
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    );
}
