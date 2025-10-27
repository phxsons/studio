"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { UserProfile } from "@/lib/types";
import { Instagram, Facebook, Linkedin, Share2, User as UserIcon, Save } from "lucide-react";

interface ProfileFormProps {
  profile: UserProfile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your avatar and personal details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatarUrl} alt={profile.name} data-ai-hint="person face"/>
                <AvatarFallback>
                  <UserIcon className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <Button variant="outline">Change Avatar</Button>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={profile.name} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="home-location">Home Location</Label>
              <Input id="home-location" defaultValue={profile.homeLocation} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Details</CardTitle>
            <CardDescription>Keep your vehicle information up to date for optimized routing.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="vehicle-make">Make</Label>
              <Input id="vehicle-make" defaultValue={profile.vehicle.make} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vehicle-model">Model</Label>
              <Input id="vehicle-model" defaultValue={profile.vehicle.model} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vehicle-fuel">Fuel Type</Label>
              <Input id="vehicle-fuel" defaultValue={profile.vehicle.fuelType} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vehicle-mpg">MPG</Label>
              <Input id="vehicle-mpg" type="number" defaultValue={profile.vehicle.mpg} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interests & Hobbies</CardTitle>
            <CardDescription>Tell us what you love to do on the road.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="interests">Interests (comma-separated)</Label>
              <Textarea id="interests" defaultValue={profile.interests.join(", ")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Connectivity</CardTitle>
            <CardDescription>Link your social media for optional sharing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input className="pl-10" id="instagram" placeholder="Instagram username" defaultValue={profile.socials.instagram} />
            </div>
            <div className="relative">
              <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input className="pl-10" id="facebook" placeholder="Facebook profile URL" defaultValue={profile.socials.facebook} />
            </div>
            <div className="relative">
              <Share2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input className="pl-10" id="tiktok" placeholder="TikTok username" defaultValue={profile.socials.tiktok} />
            </div>
            <div className="relative">
              <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input className="pl-10" id="linkedin" placeholder="LinkedIn profile URL" defaultValue={profile.socials.linkedin} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">
            <Save />
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  );
}
