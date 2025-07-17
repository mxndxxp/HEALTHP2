// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence, doc, getDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase with error handling
let app;
let db;
let storage;

try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    storage = getStorage(app);

    // Enable offline persistence with error handling, but only in the browser
    if (typeof window !== 'undefined') {
        enableIndexedDbPersistence(db).catch((err) => {
            console.error("Firestore offline persistence error:", err);
            if (err.code === 'failed-precondition') {
                console.warn("Offline persistence only available in one tab");
            } else if (err.code === 'unimplemented') {
                console.warn("Browser doesn't support offline persistence");
            }
        });
    }
} catch (initError) {
    console.error("Firebase initialization failed:", initError);
    // You might want to throw the error or handle it in a way that
    // dependent parts of the app know initialization failed.
}

const testDatabaseConnection = async () => {
    try {
        if (!db) throw new Error("Database not initialized");
        
        // Test connection with a simple document read.
        // This doc doesn't need to exist. The attempt itself is the test.
        const testDocRef = doc(db, 'connection-test', 'test');
        await getDoc(testDocRef);
        return true;
    } catch (err: any) {
        // Firestore throws 'unavailable' code when it can't connect.
        // Other errors might also indicate connection issues.
        console.error("Database connection test failed:", err);
        return false;
    }
};

export { db, app, storage, testDatabaseConnection };
