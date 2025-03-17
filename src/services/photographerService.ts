import { PhotoOfTheDay } from '../types';

// Featured Indian Wildlife Photographers from Tripoto's Top 10
const PHOTOGRAPHERS: PhotoOfTheDay[] = [
  {
    imageUrl: '/images/photographers/wildlife/tiger.jpg',
    animalName: 'Royal Bengal Tiger',
    animalDescription: 'A stunning capture of a Royal Bengal Tiger in its natural habitat, showcasing the raw power and beauty of India\'s national animal. The photograph captures the tiger\'s intense gaze and majestic presence in the wilderness.',
    photographer: {
      name: 'Sudhir Shivaram',
      imageUrl: '/images/photographers/profiles/sudhir-shivaram.jpg'
    },
    source: 'Indian Wildlife Photography',
    learnMoreUrl: 'https://www.tripoto.com/india/trips/10-best-indian-wildlife-photographers-who-can-inspire-you-to-travel-explore-national-parks-5e1024724d71a',
    bio: 'Sudhir Shivaram is one of India\'s most renowned wildlife photographers. A former software engineer turned full-time wildlife photographer, he conducts workshops across India and has won multiple awards for his work. His specialty lies in capturing intimate moments of wildlife behavior.'
  },
  {
    imageUrl: '/images/photographers/wildlife/black-panther.jpg',
    animalName: 'Black Panther of Kabini',
    animalDescription: 'A rare sighting of the elusive black panther in Kabini Forest, Karnataka. The photograph captures the mysterious beauty of this melanistic leopard against the lush green backdrop of the Western Ghats.',
    photographer: {
      name: 'Shaaz Jung',
      imageUrl: '/images/photographers/profiles/shaaz-jung.jpg'
    },
    source: 'Indian Wildlife Photography',
    learnMoreUrl: 'https://www.tripoto.com/india/trips/10-best-indian-wildlife-photographers-who-can-inspire-you-to-travel-explore-national-parks-5e1024724d71a',
    bio: 'Shaaz Jung, known as "The Leopard Man of India", has dedicated years to documenting the rare black panthers of Kabini. His unique style combines wildlife photography with fine art, creating mesmerizing portraits of India\'s big cats.'
  },
  {
    imageUrl: '/images/photographers/wildlife/snow-leopard.jpg',
    animalName: 'Himalayan Wildlife',
    animalDescription: 'A breathtaking capture of the snow leopard in the harsh terrain of the Himalayas. This image represents countless hours of patience in extreme conditions to document one of the world\'s most elusive big cats.',
    photographer: {
      name: 'Dhritiman Mukherjee',
      imageUrl: '/images/photographers/profiles/dhritiman-mukherjee.jpg'
    },
    source: 'Indian Wildlife Photography',
    learnMoreUrl: 'https://www.tripoto.com/india/trips/10-best-indian-wildlife-photographers-who-can-inspire-you-to-travel-explore-national-parks-5e1024724d71a',
    bio: 'Dhritiman Mukherjee is known for his extraordinary dedication to wildlife photography, often spending months in challenging terrains. His work has been featured in National Geographic and BBC, and he specializes in capturing rare and endangered species.'
  },
  {
    imageUrl: '/images/photographers/wildlife/birds.jpg',
    animalName: 'Birds of India',
    animalDescription: 'A vibrant capture of India\'s avian diversity, showcasing the incredible variety of bird species found across the country\'s diverse ecosystems.',
    photographer: {
      name: 'Rathika Ramasamy',
      imageUrl: '/images/photographers/profiles/rathika-ramasamy.jpg'
    },
    source: 'Indian Wildlife Photography',
    learnMoreUrl: 'https://www.tripoto.com/india/trips/10-best-indian-wildlife-photographers-who-can-inspire-you-to-travel-explore-national-parks-5e1024724d71a',
    bio: 'Rathika Ramasamy is India\'s first woman wildlife photographer who has made a mark in this male-dominated field. She specializes in bird photography and has documented over 500 species of birds across India.'
  },
  {
    imageUrl: '/images/photographers/wildlife/conservation.jpg',
    animalName: 'Wildlife Conservation',
    animalDescription: 'A powerful image highlighting the importance of wildlife conservation, capturing the delicate balance between humans and nature in India\'s protected areas.',
    photographer: {
      name: 'Kalyan Varma',
      imageUrl: '/images/photographers/profiles/kalyan-varma.jpg'
    },
    source: 'Indian Wildlife Photography',
    learnMoreUrl: 'https://www.tripoto.com/india/trips/10-best-indian-wildlife-photographers-who-can-inspire-you-to-travel-explore-national-parks-5e1024724d71a',
    bio: 'Kalyan Varma is a wildlife photographer, filmmaker, and conservationist. His work focuses on environmental issues and wildlife conservation. He has contributed to several BBC wildlife documentaries and National Geographic projects.'
  }
];

let currentIndex = 0;

export async function fetchPhotoOfTheDay(): Promise<PhotoOfTheDay> {
  return Promise.resolve(PHOTOGRAPHERS[currentIndex]);
}

export function getNextPhotographer(): PhotoOfTheDay {
  currentIndex = (currentIndex + 1) % PHOTOGRAPHERS.length;
  return PHOTOGRAPHERS[currentIndex];
}

export function getPreviousPhotographer(): PhotoOfTheDay {
  currentIndex = (currentIndex - 1 + PHOTOGRAPHERS.length) % PHOTOGRAPHERS.length;
  return PHOTOGRAPHERS[currentIndex];
}