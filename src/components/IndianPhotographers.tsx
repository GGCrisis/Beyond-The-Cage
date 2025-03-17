import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import ImageModal from './ImageModal';
import { PhotoOfTheDay } from '../types';
import { fetchPhotoOfTheDay, getNextPhotographer, getPreviousPhotographer } from '../services/photographerService';

export default function IndianPhotographers() {
  const [currentPhoto, setCurrentPhoto] = useState<PhotoOfTheDay | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);

  // Load initial photographer
  useEffect(() => {
    fetchPhotoOfTheDay().then(setCurrentPhoto);
  }, []);

  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    const next = getNextPhotographer();
    setCurrentPhoto(next);
    // Quick transition for smooth effect
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    const previous = getPreviousPhotographer();
    setCurrentPhoto(previous);
    // Quick transition for smooth effect
    setTimeout(() => setIsTransitioning(false), 300);
  };

  if (!currentPhoto) {
    return (
      <div className="w-full p-4 text-center">
        <p>Loading photographer details...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Featured Indian Wildlife Photographers</h2>
        
        <div className="relative">
          {/* Main Photo */}
          <div 
            className="relative h-[600px] mb-4 cursor-pointer"
            onClick={() => setSelectedImage({ 
              url: currentPhoto.imageUrl, 
              title: `${currentPhoto.animalName} by ${currentPhoto.photographer.name}` 
            })}
          >
            <img
              src={currentPhoto.imageUrl}
              alt={currentPhoto.animalName}
              className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white p-4 rounded-full hover:bg-black/80 transition-all duration-200 transform hover:scale-110"
          >
            <ChevronLeft size={36} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white p-4 rounded-full hover:bg-black/80 transition-all duration-200 transform hover:scale-110"
          >
            <ChevronRight size={36} />
          </button>
        </div>

        {/* Photographer Info */}
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                onClick={() => setSelectedImage({ 
                  url: currentPhoto.photographer.imageUrl, 
                  title: currentPhoto.photographer.name 
                })}
                className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={currentPhoto.photographer.imageUrl}
                  alt={currentPhoto.photographer.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-primary-500 shadow-lg hover:border-primary-600"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{currentPhoto.photographer.name}</h3>
                <p className="text-gray-600">{currentPhoto.animalName}</p>
              </div>
            </div>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <Info size={20} />
              Know More
            </button>
          </div>
        </div>

        {/* Expanded Info Modal */}
        {showInfo && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-6">{currentPhoto.photographer.name}</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <img
                    src={currentPhoto.photographer.imageUrl}
                    alt={currentPhoto.photographer.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary-500"
                  />
                  <div>
                    <h4 className="font-semibold text-lg">{currentPhoto.photographer.name}</h4>
                    <p className="text-gray-600">Wildlife Photographer</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">About the Photographer</h4>
                  <p className="text-gray-700">{currentPhoto.bio}</p>
                </div>
                <div>
                  <h4 className="font-semibold">About the Photo</h4>
                  <p className="text-gray-700">{currentPhoto.animalDescription}</p>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowInfo(false)}
                    className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Modal for Profile Photo */}
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