'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { SuggestedDestination } from "@/ai/flows/suggest-destinations";
import { Star, MapPin } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Badge } from "../ui/badge";

interface SuggestedDestinationsCardProps {
    destinations: SuggestedDestination[] | null;
    isLoading: boolean;
}

const DestinationItem = ({ destination }: { destination: SuggestedDestination }) => (
    <Card className="h-full flex flex-col">
        <CardHeader>
            <CardTitle className="text-xl">{destination.name}</CardTitle>
            <CardDescription className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {destination.location}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between">
            <div>
                <p className="text-sm text-muted-foreground">{destination.description}</p>
            </div>
            <div className="flex items-center justify-between mt-4">
                <Badge variant="secondary" className="capitalize">{destination.category}</Badge>
                <div className="flex items-center gap-1 font-bold text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span>{destination.rating.toFixed(1)}</span>
                </div>
            </div>
        </CardContent>
    </Card>
);

export default function SuggestedDestinationsCard({ destinations, isLoading }: SuggestedDestinationsCardProps) {
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Interest-Based Discovery</CardTitle>
                <CardDescription>Your next adventure could include one of these top-rated spots.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
                    </div>
                ) : (
                    <Carousel opts={{ align: "start" }} className="w-full">
                        <CarouselContent>
                            {destinations?.map((destination, index) => (
                                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                                    <div className="p-1 h-full">
                                        <DestinationItem destination={destination} />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden sm:flex" />
                        <CarouselNext className="hidden sm:flex" />
                    </Carousel>
                )}
            </CardContent>
        </Card>
    );
}
