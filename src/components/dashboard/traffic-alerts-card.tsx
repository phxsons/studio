'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { TrafficAlert } from "@/ai/flows/get-traffic-for-route";
import { AlertCircle, Car, Construction, XOctagon, LucideProps, TrafficCone } from 'lucide-react';
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import { ComponentType } from "react";

interface TrafficAlertsCardProps {
    alerts: TrafficAlert[] | null;
    isLoading: boolean;
}

const alertDetails: {
    [key in TrafficAlert['type']]: { icon: ComponentType<LucideProps>; color: string };
} = {
    congestion: { icon: Car, color: 'text-yellow-500' },
    accident: { icon: AlertCircle, color: 'text-red-500' },
    construction: { icon: Construction, color: 'text-orange-500' },
    road_closure: { icon: XOctagon, color: 'text-red-700' },
};


export default function TrafficAlertsCard({ alerts, isLoading }: TrafficAlertsCardProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </CardContent>
            </Card>
        )
    }

    if (!alerts) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Traffic Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {alerts.length > 0 ? alerts.map((alert, index) => {
                    const details = alertDetails[alert.type] || { icon: TrafficCone, color: 'text-foreground' };
                    const Icon = details.icon;
                    return (
                        <div key={index}>
                            <div className="flex items-start gap-4">
                                <Icon className={cn("w-8 h-8 mt-1", details.color)} />
                                <div>
                                    <p className="font-semibold">{alert.location}</p>
                                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                                    <p className="text-xs text-muted-foreground/80 capitalize pt-1">Severity: {alert.severity}</p>
                                </div>
                            </div>
                            {index < alerts.length - 1 && <Separator className="mt-4" />}
                        </div>
                    )
                }) : (
                    <p className="text-sm text-muted-foreground">No major traffic alerts on your route. Drive safe!</p>
                )}
            </CardContent>
        </Card>
    );
}
