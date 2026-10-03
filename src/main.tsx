import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { testFirestoreConnection } from './firebase';
import { ErrorBoundary } from './components/ErrorBoundary';

// Safely test connection to Firestore on boot (non-blocking)
try {
  testFirestoreConnection().catch((err) => {
    console.warn("Firebase boot notice (offline/local fallback active):", err);
  });
} catch (e) {
  console.warn("Firebase init notice:", e);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
