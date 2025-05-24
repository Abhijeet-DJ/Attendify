// This file is no longer needed for Firebase Auth if Clerk is used.
// If you use other Firebase services (Firestore, Storage, etc.),
// keep the parts relevant to those services.
// For now, assuming only Auth was used, this can be effectively empty or deleted.

// Example: If you were still using Firestore
// import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
// import { getFirestore, Firestore } from 'firebase/firestore';
//
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, // Ensure these are still in .env if needed for other services
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };
//
// let app: FirebaseApp;
// let firestore: Firestore;
//
// if (getApps().length === 0) {
//   app = initializeApp(firebaseConfig);
// } else {
//   app = getApp();
// }
//
// firestore = getFirestore(app);
//
// export { app, firestore };

export {}; // Add an empty export if not deleting immediately.
