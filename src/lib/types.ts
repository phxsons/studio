export type UserProfile = {
  name: string;
  avatarUrl: string;
  vehicle: {
    make: string;
    model: string;
    fuelType: string;
    mpg: number;
  };
  homeLocation: string;
  interests: string[];
  socials: {
    instagram: string;
    facebook: string;
    tiktok: string;
    linkedin: string;
  };
};

export type PointOfInterest = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: {
    src: string;
    hint: string;
  };
};

export type Stop = {
  id: string;
  name: string;
  location: string;
  icon: React.ElementType;
};

export type WeatherAlert = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
};

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};
