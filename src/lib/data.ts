import type { UserProfile, PointOfInterest, Stop, WeatherAlert, ImagePlaceholder } from './types';
import { Utensils, Tent, Mountain, Music, Sun, CloudRain } from 'lucide-react';
import data from './placeholder-images.json';

const allPlaceholderImages: ImagePlaceholder[] = data.placeholderImages;

export const userProfile: UserProfile = {
  name: "Alex Ryder",
  avatarUrl: allPlaceholderImages.find(p => p.id === 'user-avatar')?.imageUrl || '',
  vehicle: {
    make: "Jeep",
    model: "Wrangler",
    fuelType: "Gasoline",
    mpg: 22,
  },
  homeLocation: "Denver, CO",
  interests: ["Hiking", "Photography", "Live Music", "Craft Beer"],
  socials: {
    instagram: "alexontheroad",
    facebook: "",
    tiktok: "roadtrippin_alex",
    linkedin: "",
  },
};

export const pois: PointOfInterest[] = [
  {
    id: "poi-1",
    title: "Mountain Vista Music Fest",
    category: "Event",
    description: "Annual festival featuring indie bands.",
    image: {
      src: allPlaceholderImages.find(p => p.id === 'poi-festival')?.imageUrl || '',
      hint: "music festival"
    }
  },
  {
    id: "poi-2",
    title: "The Savory Spoon",
    category: "Restaurant",
    description: "Farm-to-table dining experience.",
    image: {
      src: allPlaceholderImages.find(p => p.id === 'poi-restaurant')?.imageUrl || '',
      hint: "gourmet food"
    }
  },
  {
    id: "poi-3",
    title: "The Wanderer's Inn",
    category: "Lodging",
    description: "Cozy hotel with great mountain views.",
    image: {
      src: allPlaceholderImages.find(p => p.id === 'poi-hotel')?.imageUrl || '',
      hint: "hotel interior"
    }
  },
  {
    id: "poi-4",
    title: "Eagle Peak Trail",
    category: "Hike",
    description: "Challenging but rewarding trail.",
     image: {
      src: allPlaceholderImages.find(p => p.id === 'poi-hike')?.imageUrl || '',
      hint: "mountain trail"
    }
  },
  {
    id: "poi-5",
    title: "Riverside Camping",
    category: "Lodging",
    description: "Quiet campground next to a river.",
    image: {
        src: allPlaceholderImages.find(p => p.id === 'poi-camping')?.imageUrl || '',
        hint: "riverside camping"
    }
  }
];

export const stops: Stop[] = [
  {
    id: "stop-1",
    name: "Moab, Utah",
    location: "Next stop in 120 miles",
    icon: Mountain,
  },
  {
    id: "stop-2",
    name: "Zion National Park",
    location: "Stop for 2 days",
    icon: Tent,
  },
  {
    id: "stop-3",
    name: "Las Vegas, Nevada",
    location: "Overnight stay",
    icon: Music,
  },
    {
    id: "stop-4",
    name: "Grand Canyon Village",
    location: "Pit stop for lunch",
    icon: Utensils,
  },
];

export const weatherAlerts: WeatherAlert[] = [
    {
        id: 'weather-1',
        title: 'Clear Skies Ahead',
        description: 'Sunny conditions expected for the next 200 miles. Perfect for driving.',
        icon: Sun,
    },
    {
        id: 'weather-2',
        title: 'Rain Expected',
        description: 'Light showers possible near Flagstaff. Roads may be slick.',
        icon: CloudRain,
    }
];

export const placeholderImages: ImagePlaceholder[] = allPlaceholderImages;
