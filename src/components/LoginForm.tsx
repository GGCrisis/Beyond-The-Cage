import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bird, UserPlus, LogIn } from 'lucide-react';
import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  AuthError
} from 'firebase/auth';

export default function LoginForm() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (!isLoginMode) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        // Create new user
        await createUserWithEmailAndPassword(auth, email, password);
        navigate('/gallery');
      } else {
        // Sign in existing user
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/gallery');
      }
    } catch (err) {
      const firebaseError = err as AuthError;
      switch (firebaseError.code) {
        case 'auth/email-already-in-use':
          setError('Email already exists');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Invalid email or password');
          break;
        default:
          setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sage-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <div className="flex justify-center">
            <Bird className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-earth-800">
            Welcome to Beyond the Cage
          </h2>
          <p className="mt-2 text-center text-sm text-earth-600">
            {isLoginMode ? 'Login to share your wildlife sightings' : 'Create your account'}
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setIsLoginMode(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              isLoginMode
                ? 'bg-primary-600 text-white'
                : 'bg-sage-100 text-earth-600 hover:bg-sage-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Login
          </button>
          <button
            onClick={() => setIsLoginMode(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              !isLoginMode
                ? 'bg-primary-600 text-white'
                : 'bg-sage-100 text-earth-600 hover:bg-sage-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Register
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-earth-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-sage-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-earth-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-sage-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            {!isLoginMode && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-earth-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-sage-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            {isLoginMode ? 'Sign in' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}