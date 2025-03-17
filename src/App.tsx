import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import UploadForm from './components/UploadForm';
import Gallery from './components/Gallery';
import Search from './components/Search';
import { Sighting } from './types';
import './index.css';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    const savedSightings = localStorage.getItem('sightings');
    if (savedSightings) {
      setSightings(JSON.parse(savedSightings));
    } else {
      // Add all wildlife photos as initial sightings
      const wildlifePhotos = [
        {
          id: 'birds',
          imageUrl: '/images/photographers/wildlife/birds.jpg',
          species: 'Birds',
          sanctuaryName: 'Various Sanctuaries',
          timestamp: new Date().toISOString(),
          userId: 'default',
          userEmail: 'admin@beyondthecage.com'
        },
        {
          id: 'black-panther',
          imageUrl: '/images/photographers/wildlife/black-panther.jpg',
          species: 'Black Panther',
          sanctuaryName: 'Kabini Forest',
          timestamp: new Date().toISOString(),
          userId: 'default',
          userEmail: 'admin@beyondthecage.com'
        },
        {
          id: 'snow-leopard',
          imageUrl: '/images/photographers/wildlife/snow-leopard.jpg',
          species: 'Snow Leopard',
          sanctuaryName: 'Hemis National Park',
          timestamp: new Date().toISOString(),
          userId: 'default',
          userEmail: 'admin@beyondthecage.com'
        },
        {
          id: 'tiger',
          imageUrl: '/images/photographers/wildlife/tiger.jpg',
          species: 'Bengal Tiger',
          sanctuaryName: 'Jim Corbett National Park',
          timestamp: new Date().toISOString(),
          userId: 'default',
          userEmail: 'admin@beyondthecage.com'
        }
      ];
      setSightings(wildlifePhotos);
      localStorage.setItem('sightings', JSON.stringify(wildlifePhotos));
    }

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleUpload = (data: { imageUrl: string; species: string; sanctuaryName: string }) => {
    if (!currentUser || !currentUser.email) return;

    const newSighting: Sighting = {
      id: Date.now().toString(),
      ...data,
      timestamp: new Date().toISOString(),
      userId: currentUser.uid,
      userEmail: currentUser.email,
    };

    const updatedSightings = [...sightings, newSighting];
    setSightings(updatedSightings);
    localStorage.setItem('sightings', JSON.stringify(updatedSightings));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If user is not logged in, show login page
  if (!currentUser) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header isLoggedIn={!!currentUser} onLogout={handleLogout} />
        <main className="container mx-auto py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/gallery" />} />
            <Route path="/upload" element={<UploadForm onUpload={handleUpload} />} />
            <Route path="/gallery" element={<Gallery sightings={sightings} />} />
            <Route path="/search" element={<Search sightings={sightings} />} />
            <Route path="*" element={<Navigate to="/gallery" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
