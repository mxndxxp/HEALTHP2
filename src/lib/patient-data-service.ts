
// This service now uses Firestore for persistent data storage.
import type { HealthData, CaseHistoryItem } from './types';
import { db, testDatabaseConnection } from './firebase';
import { doc, getDoc, setDoc, getDocFromCache, collection, getDocs, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { getAllDoctors } from './doctor-service';


const getInitialHealthData = async (): Promise<HealthData> => {
  const doctors = await getAllDoctors();
  
  return {
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
      doctors: doctors,
      booking: {
          patientName: '',
          problem: '',
          report: null,
          uniqueId: '',
          doctorId: null,
      }
    },
    caseHistory: [],
  };
};


export const getPatientData = async (patientId: string, isOnline: boolean): Promise<{ data: HealthData, source: 'server' | 'cache' }> => {
    if (!patientId) {
        throw new Error("Patient ID is required");
    }
    const patientDocRef = doc(db, 'patients', patientId);

    if (isOnline) {
        try {
            const isDbConnected = await testDatabaseConnection();
            if (!isDbConnected) {
                throw new Error("Could not connect to the database. Please check your internet connection and try again.");
            }
            const serverSnap = await getDoc(patientDocRef);
            if (serverSnap.exists()) {
                // Ensure the doctor list is up-to-date
                const doctors = await getAllDoctors();
                const patientData = serverSnap.data() as HealthData;
                patientData.consultation.doctors = doctors;
                return { data: { id: serverSnap.id, ...patientData } as HealthData, source: 'server' };
            }
        } catch (serverError: any) {
            console.warn('Server fetch failed, falling back to cache', serverError.message);
        }
    }

    try {
        const cacheSnap = await getDocFromCache(patientDocRef);
        if (cacheSnap.exists()) {
             const doctors = await getAllDoctors();
             const patientData = cacheSnap.data() as HealthData;
             patientData.consultation.doctors = doctors;
            return { data: { id: cacheSnap.id, ...patientData } as HealthData, source: 'cache' };
        }
    } catch (cacheError) {
        // This will happen if offline and not in cache.
    }

    console.log(`Creating new Firestore document for patientId: ${patientId}`);
    const newPatientData = await getInitialHealthData();
    await setDoc(patientDocRef, newPatientData);
    return { data: newPatientData, source: 'server' };
};

export const savePatientData = async (patientId: string, data: HealthData): Promise<HealthData> => {
    const patientDocRef = doc(db, 'patients', patientId);
    console.log(`Saving data to Firestore for patientId: ${patientId}`);
    
    const cleanData = JSON.parse(JSON.stringify(data, (key, value) => {
        if (typeof window !== 'undefined' && value instanceof File) {
            return null; 
        }
        if (key === 'doctors') {
          return undefined; // Don't save the doctors list back to the patient document
        }
        return value;
    }));

    await setDoc(patientDocRef, cleanData, { merge: true });
    return data;
};

export const getAllPatients = async (): Promise<HealthData[]> => {
    const patientsCol = collection(db, 'patients');
    const patientSnapshot = await getDocs(patientsCol);
    const patientList = patientSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HealthData));
    return patientList;
};

export const addCaseHistoryEvent = async (patientId: string, event: Omit<CaseHistoryItem, 'id' | 'timestamp'>) => {
    if (!patientId) return;
    const patientDocRef = doc(db, 'patients', patientId);
    const newEvent = {
        ...event,
        id: Date.now(),
        timestamp: serverTimestamp(),
    };
    await updateDoc(patientDocRef, {
        caseHistory: arrayUnion(newEvent)
    });
};
