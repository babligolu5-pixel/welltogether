import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore/lite';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  config.apiKey && config.projectId && config.appId,
);

/** Test-only escape hatch so the enquiry UI can be exercised without a project. */
export const isE2EMode = import.meta.env.VITE_E2E_MODE === '1';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

/**
 * Static imports matter here: the modular SDK registers its Firestore
 * provider as a module side effect, and a split/lazy module graph can drop it,
 * which surfaces as "Service firestore is not available". Keeping the imports
 * static (inside a lazily loaded component chunk) keeps one valid registry.
 */
export function getDb(): Firestore {
  if (!isFirebaseConfigured) {
    throw new Error('firebase-not-configured');
  }
  if (!db) {
    app ??= initializeApp(config);
    db = getFirestore(app);
  }
  return db;
}
