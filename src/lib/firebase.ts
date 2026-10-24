import type { Firestore } from 'firebase/firestore';

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

let dbPromise: Promise<Firestore> | null = null;

export function getDb(): Promise<Firestore> {
  if (!isFirebaseConfigured) {
    return Promise.reject(new Error('firebase-not-configured'));
  }

  dbPromise ??= (async () => {
    const [{ initializeApp }, { getFirestore }] = await Promise.all([
      import('firebase/app'),
      import('firebase/firestore'),
    ]);
    return getFirestore(initializeApp(config));
  })();

  return dbPromise;
}
