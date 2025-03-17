import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBosH83GOUiGx7hEI93XW1mgXdDa1WBrI",
  authDomain: "wildlife-c42dd.firebaseapp.com",
  projectId: "wildlife-c42dd",
  storageBucket: "wildlife-c42dd.firebasestorage.app",
  messagingSenderId: "274091920560",
  appId: "1:274091920560:web:637a8cc2a51bd0c481bf75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;