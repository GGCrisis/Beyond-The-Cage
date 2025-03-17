import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sighting } from '../types';
import { MapPin, Bird, Camera, Upload, Search as SearchIcon, Calendar, User } from 'lucide-react';
import ImageModal from './ImageModal';

interface SearchProps {
  sightings: Sighting[];
}

export default function Search({ sightings }: SearchProps): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);
  const [showStats, setShowStats] = useState(false);

  // Filter sightings based on search term (species or sanctuary)
  const filteredSightings = sightings.filter(
    (sighting) =>
      sighting.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sighting.sanctuaryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate sanctuary statistics
  const calculateStats = () => {
    const sanctuaryCounts = filteredSightings.reduce((acc: Record<string, number>, sighting) => {
      acc[sighting.sanctuaryName] = (acc[sighting.sanctuaryName] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(sanctuaryCounts)
      .map(([sanctuary, count]) => ({ sanctuary, count }))
      .sort((a, b) => b.count - a.count);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 mb-8 text-white">
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
            <Bird className="w-8 h-8" />
            Find Wildlife
          </h2>
          <p className="text-primary-100 mb-6">
            Discover the best sanctuaries to spot your favorite species
          </p>
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-earth-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by species or sanctuary name..."
              className="w-full pl-12 pr-4 py-4 rounded-lg text-earth-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <button
            onClick={() => setShowStats(!showStats)}
            className="mt-4 w-full bg-white text-primary-700 px-6 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors duration-200"
          >
            {showStats ? 'Show Photos' : 'Show Sanctuary Statistics'}
          </button>
        </div>

        {/* Upload Section */}
        <div className="bg-sage-50 rounded-xl p-6 mb-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 bg-white rounded-full">
              <Camera className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-earth-800">Share Your Wildlife Sighting</h3>
            <p className="text-earth-600">
              Have you spotted wildlife? Share your experience with the community!
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              <Upload className="w-5 h-5" />
              Upload Photo
            </Link>
          </div>
        </div>

        {/* Results Section */}
        {showStats ? (
          // Sanctuary Statistics View
          filteredSightings.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-xl mb-6 text-earth-800">Recommended Sanctuaries</h3>
              <div className="space-y-4">
                {calculateStats().map(({ sanctuary, count }) => (
                  <div
                    key={sanctuary}
                    className="flex items-center justify-between p-4 bg-sage-50 rounded-lg hover:bg-sage-100 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="text-primary-600" />
                      <span className="font-medium text-earth-800">{sanctuary}</span>
                    </div>
                    <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                      {count} sighting{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        ) : (
          // Photo Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredSightings.map((sighting) => (
              <div
                key={sighting.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-200 hover:shadow-xl"
              >
                <div 
                  className="relative cursor-pointer"
                  onClick={() => setSelectedImage({ 
                    url: sighting.imageUrl, 
                    title: `${sighting.species} at ${sighting.sanctuaryName}` 
                  })}
                >
                  <img
                    src={sighting.imageUrl}
                    alt={sighting.species}
                    className="w-full h-72 object-cover transition-transform duration-200 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-earth-900/80 via-earth-900/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-bold text-2xl text-white mb-2">{sighting.species}</h3>
                    <div className="flex items-center gap-2 text-white/90">
                      <MapPin className="w-4 h-4" />
                      <span>{sighting.sanctuaryName}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4 border-t border-sage-100">
                  <div className="flex items-center gap-3 text-earth-600">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    <span>{new Date(sighting.timestamp).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-3 text-earth-600">
                    <User className="w-5 h-5 text-primary-600" />
                    <span>Posted by <span className="font-medium">{sighting.userEmail}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {searchTerm && filteredSightings.length === 0 && (
          <div className="text-center py-8 bg-white rounded-xl shadow-md">
            <SearchIcon className="w-16 h-16 mx-auto text-earth-400 mb-4" />
            <p className="text-earth-500 text-lg">No sightings found matching "{searchTerm}"</p>
          </div>
        )}

        {/* Image Modal */}
        <ImageModal
          isOpen={!!selectedImage}
          imageUrl={selectedImage?.url || ''}
          title={selectedImage?.title || ''}
          onClose={() => setSelectedImage(null)}
        />
      </div>
    </div>
  );
}