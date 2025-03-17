import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, X } from 'lucide-react';

interface UploadFormProps {
  onUpload: (data: { imageUrl: string; species: string; sanctuaryName: string }) => void;
}

export default function UploadForm({ onUpload }: UploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [animalName, setAnimalName] = useState('');
  const [sanctuaryName, setSanctuaryName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !previewUrl) return;

    setIsLoading(true);
    setError('');

    try {
      onUpload({
        imageUrl: previewUrl,
        species: animalName,
        sanctuaryName: sanctuaryName
      });
      navigate('/gallery');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload photo');
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3 text-primary-700">
        <Camera className="w-8 h-8" />
        Upload Wildlife Sighting
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ease-in-out
            ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-sage-300 hover:border-primary-400'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {!previewUrl ? (
            <div className="space-y-4">
              <Upload className="w-12 h-12 mx-auto text-earth-400" />
              <div>
                <p className="text-earth-600">Drag and drop your image here, or</p>
                <label className="mt-2 inline-block px-4 py-2 bg-primary-600 text-white rounded-lg cursor-pointer hover:bg-primary-700 transition-colors duration-200">
                  Browse Files
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileInput}
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg shadow-md"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-earth-700 font-medium mb-2">Animal Name</label>
            <input
              type="text"
              value={animalName}
              onChange={(e) => setAnimalName(e.target.value)}
              className="w-full p-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              required
              placeholder="e.g., Bengal Tiger"
            />
          </div>

          <div>
            <label className="block text-earth-700 font-medium mb-2">Sanctuary Name</label>
            <input
              type="text"
              value={sanctuaryName}
              onChange={(e) => setSanctuaryName(e.target.value)}
              className="w-full p-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              required
              placeholder="e.g., Jim Corbett National Park"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!selectedFile || !animalName || !sanctuaryName || isLoading}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-lg font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Uploading...' : 'Upload Sighting'}
        </button>
      </form>
    </div>
  );
}