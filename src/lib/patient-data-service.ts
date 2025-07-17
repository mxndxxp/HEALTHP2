// This service now uses Firestore for persistent data storage.
import type { HealthData } from './types';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const initialHealthData: HealthData = {
  patientInfo: {
    name: '',
    age: '',
    gender: '',
    email: '',
    phone: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      district: '',
      state: '',
      postalCode: '',
    },
    height: '',
    weight: '',
    uniqueId: '',
    avatar: "https://placehold.co/200x200.png",
    dob: '',
    birthTime: '',
    birthPlace: '',
    deliveryType: 'normal',
    deliveryTime: '',
    occupation: '',
    maritalStatus: '',
    dateOfVisit: new Date().toISOString().split('T')[0],
    referredBy: '',
  },
  medicalHistory: {
    chiefComplaints: [],
    historyOfPresentIllness: {
      symptoms: '',
      onset: '',
      duration: '',
      frequencyTiming: '',
      progression: '',
      location: '',
      radiation: '',
      character: '',
      severity: 5,
      associatedSymptoms: '',
      aggravatingFactors: '',
      relievingFactors: '',
      previousEpisodes: '',
      impact: '',
    },
    pastHistory: {
      conditions: [],
      trauma: '',
      bloodTransfusions: '',
      allergies: '',
      immunizations: '',
    },
    medications: {
      prescribed: [],
      supplements: '',
      compliance: '',
      recentChanges: '',
    },
    familyHistory: {
      conditions: [],
      familyHealthStatus: '',
      consanguinity: '',
    },
    documents: {
      reports: null,
      prescriptions: null,
      photos: null,
    },
  },
  lifestyleAssessment: {
    sleep: {
      bedtime: '23:00',
      wakeTime: '07:00',
      quality: '',
      issues: [],
      dreamFrequency: '',
      notes: '',
      photo: null,
    },
    diet: {
      dietType: '',
      waterIntake: 2,
      hungerLevel: 5,
      favoriteFood: '',
      foodAllergies: '',
      tastes: {
        sweet: false,
        sour: false,
        salty: false,
        bitter: false,
        pungent: false,
        astringent: false,
      },
      thirstLevel: 'normal',
      notes: '',
      photo: null,
    },
    activity: {
      level: '',
      notes: '',
      photo: null,
    },
    stress: {
      level: '',
      caffeineIntake: '',
      primaryEmotion: '',
      emotionNotes: '',
      notes: '',
      photo: null,
    },
    substance: {
      smokingStatus: '',
      alcoholConsumption: '',
      notes: '',
      photo: null,
    },
    stool: {
      color: 'Brown',
      type: '4',
      problems: [],
      notes: '',
      photo: null,
    },
    urine: {
      color: 'Yellow',
      dayFrequency: 'normal',
      nightFrequency: '0-1',
      problems: [],
      notes: '',
      photo: null,
    },
    menstruation: {
      lastPeriodDate: '',
      cycleLength: 28,
      duration: 5,
      isRegular: 'yes',
      flow: 'medium',
      bloodColor: 'Dark Red',
      symptoms: [],
      painLevel: 5,
      notes: '',
      photo: null,
    },
  },
  patientImprovementReview: [],
  consultation: {
    doctors: [
        { id: 1, name: 'Dr. Evelyn Reed', specialization: 'Cardiologist', avatar: 'https://placehold.co/100x100.png' },
        { id: 2, name: 'Dr. Ben Carter', specialization: 'Neurologist', avatar: 'https://placehold.co/100x100.png' },
        { id: 3, name: 'Dr. Olivia Chen', specialization: 'Dermatologist', avatar: 'https://placehold.co/100x100.png' },
    ],
    booking: {
        patientName: '',
        problem: '',
        report: null,
        uniqueId: '',
        doctorId: null,
    }
  }
};


export const getPatientData = async (patientId: string): Promise<HealthData> => {
    if (!patientId) {
        throw new Error("Patient ID is required");
    }
    const patientDocRef = doc(db, 'patients', patientId);
    const docSnap = await getDoc(patientDocRef);

    if (docSnap.exists()) {
        // Return existing data
        return docSnap.data() as HealthData;
    } else {
        // If patient doesn't exist, create and return a new record for them.
        console.log(`Creating new Firestore document for patientId: ${patientId}`);
        // Deep copy initial data to avoid mutation
        const newPatientData = JSON.parse(JSON.stringify(initialHealthData));
        await setDoc(patientDocRef, newPatientData);
        return newPatientData;
    }
};

export const savePatientData = async (patientId: string, data: HealthData): Promise<HealthData> => {
    const patientDocRef = doc(db, 'patients', patientId);
    console.log(`Saving data to Firestore for patientId: ${patientId}`);
    
    // Firestore cannot store File objects, so we need to remove them before saving.
    // In a real app, you would upload these to Firebase Storage and save the URL.
    const cleanData = JSON.parse(JSON.stringify(data, (key, value) => {
        if (typeof window !== 'undefined' && value instanceof File) {
            return null; // Or return a placeholder/metadata
        }
        return value;
    }));

    await setDoc(patientDocRef, cleanData, { merge: true });
    return data; // Return original data with File objects for the client
};
