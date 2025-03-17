import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Bird } from 'lucide-react';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

export default function Header({ isLoggedIn, onLogout }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 transform hover:scale-105 transition-transform duration-200"
          >
            <Bird className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">
              Beyond the Cage
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-1">
            <Link
              to="/gallery"
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive('/gallery')
                ? 'bg-white text-primary-600 shadow-md'
                : 'hover:bg-primary-500 hover:text-white'
              }`}
            >
              Gallery
            </Link>
            
            <Link
              to="/search"
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive('/search')
                ? 'bg-white text-primary-600 shadow-md'
                : 'hover:bg-primary-500 hover:text-white'
              }`}
            >
              Animal Search
            </Link>

            <Link
              to="/upload"
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive('/upload')
                ? 'bg-white text-primary-600 shadow-md'
                : 'hover:bg-primary-500 hover:text-white'
              }`}
            >
              Upload
            </Link>

            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="ml-2 px-4 py-2 flex items-center space-x-2 rounded-lg bg-primary-500 hover:bg-primary-400 transition-all duration-200"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
