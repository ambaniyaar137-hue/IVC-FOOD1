
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Placeholder config - User should replace this with their actual Firebase config
const firebaseConfig = {
  apiKey: "placeholder-api-key",
  authDomain: "placeholder.firebaseapp.com",
  databaseURL: "https://placeholder-default-rtdb.firebaseio.com",
  projectId: "placeholder",
  storageBucket: "placeholder.appspot.com",
  messagingSenderId: "placeholder",
  appId: "placeholder"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
