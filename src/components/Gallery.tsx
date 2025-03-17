import { useState } from 'react';
import { Sighting } from '../types';
import { Search, MapPin, Calendar, User, Bird, Camera } from 'lucide-react';
import IndianPhotographers from './IndianPhotographers';
import ImageModal from './ImageModal';

interface GalleryProps {
  sightings: Sighting[];
}

export default function Gallery({ sightings }: GalleryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);

  const filteredSightings = sightings.filter(
    (sighting) =>
      sighting.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sighting.sanctuaryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,theme(colors.white/10)_1px,transparent_0)] bg-[size:40px_40px] opacity-30"></div>
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="flex justify-center mb-8">
            <Bird className="w-20 h-20 animate-float" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white/95">Wildlife Photography Gallery</h1>
          <p className="text-xl text-primary-50 mb-8 max-w-2xl mx-auto">Discover the beauty of wildlife through the lens of remarkable photographers</p>
        </div>
      </div>



      <div className="container mx-auto px-4 py-12 -mt-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Indian Wildlife Photographers */}
          <IndianPhotographers />

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-12">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-grow">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-500 w-6 h-6" />
                  <input
                    type="text"
                    placeholder="Search by species or sanctuary name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-4 py-4 text-lg border-2 border-sage-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSightings.map((sighting, index) => (
              <div
                key={sighting.id}
                className={`bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.03] transition-all duration-300 hover:shadow-2xl animate-fadeIn`}
                style={{ animationDelay: `${index * 100}ms` }}
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
                    className="w-full h-80 object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-bold text-2xl text-white mb-2">{sighting.species}</h3>
                    <div className="flex items-center gap-2 text-white/90">
                      <MapPin className="w-4 h-4" />
                      <span>{sighting.sanctuaryName}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4 border-t border-sage-100 bg-white backdrop-blur-sm">
                  <div className="flex justify-between items-start">
                    <div className="space-y-4 flex-grow">
                      <div className="flex items-center gap-3 text-earth-600">
                        <Calendar className="w-5 h-5 text-primary-600" />
                        <span className="text-sm">{new Date(sighting.timestamp).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                      <div className="flex items-center gap-3 text-earth-600">
                        <User className="w-5 h-5 text-primary-600" />
                        <span className="text-sm">By <span className="font-medium">{sighting.userEmail}</span></span>
                      </div>
                    </div>
                    <Camera className="w-6 h-6 text-primary-500 opacity-50" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results State */}
          {filteredSightings.length === 0 && searchTerm !== '' && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-xl">
              <Search className="w-16 h-16 mx-auto text-earth-400 mb-4" />
              <p className="text-earth-500 text-lg">No sightings found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={!!selectedImage}
        imageUrl={selectedImage?.url || ''}
        title={selectedImage?.title || ''}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}
