export interface Sighting {
  id: string;
  imageUrl: string;
  species: string;
  sanctuaryName: string;
  timestamp: string;
  userId: string;
  userEmail: string;
}

export interface Photographer {
  name: string;
  imageUrl: string;
}

export interface PhotoOfTheDay {
  imageUrl: string;
  animalName: string;
  animalDescription: string;
  photographer: Photographer;
  source: string;
  learnMoreUrl: string;
  bio: string;
}