import { useState, useEffect } from 'react';
import { Camera, RefreshCw } from 'lucide-react';
import { PhotoOfTheDay } from '../types';
import { fetchPhotoOfTheDay } from '../services/photographerService';

export default function PhotographerOfTheDay(): JSX.Element {
  const [photoData, setPhotoData] = useState<PhotoOfTheDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPhotoOfTheDay();
      setPhotoData(data);
    } catch (err) {
      setError('Failed to load photographer of the day');
      console.error('Error loading photo data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-[400px] bg-sage-100 rounded-lg" />
          <div className="h-8 bg-sage-100 rounded w-2/3" />
          <div className="h-20 bg-sage-100 rounded" />
        </div>
      </div>
    );
  }

  if (error || !photoData) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 text-center">
        <Camera className="w-12 h-12 mx-auto text-earth-400 mb-4" />
        <h2 className="text-xl font-semibold text-earth-800 mb-2">
          {error || 'Unable to load photographer of the day'}
        </h2>
        <p className="text-earth-600 mb-4">
          Please try again later or check out our gallery below.
        </p>
        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6">
      <div className="space-y-6">
        <div className="aspect-video relative rounded-lg overflow-hidden bg-sage-50">
          <img
            src={photoData.imageUrl}
            alt={photoData.animalName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-earth-800">{photoData.animalName}</h2>
          <p className="text-earth-600">{photoData.animalDescription}</p>

          <div className="flex items-center justify-between pt-4 border-t border-sage-100">
            <div>
              <p className="text-earth-600">
                Photographed by <span className="font-medium">{photoData.photographer.name}</span>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <a
                href={photoData.learnMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Read Full Story
              </a>
              <p className="text-xs text-earth-500">
                Source: {photoData.source}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}