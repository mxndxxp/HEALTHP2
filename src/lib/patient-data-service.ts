// This is a simple in-memory "database" for patient health data.
// In a real application, you would use a proper database like Firestore.
import type { HealthData } from './types';

type PatientDB = {
    [patientId: string]: HealthData;
};

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

const patientDB: PatientDB = {
    // Pre-seed with data for patient '1' to simulate a returning patient
    '1': {
        patientInfo: {
            name: 'Jane Smith',
            age: '42',
            gender: 'female',
            email: 'jane.smith@example.com',
            phone: '+1 (555) 987-6543',
            address: {
            line1: '456 Wellness Ave',
            line2: 'Suite 101',
            city: 'Healthville',
            district: 'Proactive County',
            state: 'State of Balance',
            postalCode: '54321',
            },
            height: '165',
            weight: '68',
            uniqueId: 'HC-JAN6543-832941',
            avatar: "https://placehold.co/200x200.png",
            dob: '1982-08-15',
            birthTime: '14:30',
            birthPlace: 'Healthville, State of Balance',
            deliveryType: 'normal',
            deliveryTime: 'Full-term',
            occupation: 'Graphic Designer',
            maritalStatus: 'married',
            dateOfVisit: new Date().toISOString().split('T')[0],
            referredBy: 'Dr. Emily White',
        },
        medicalHistory: {
            chiefComplaints: [
            { id: 1, complaint: 'Persistent Headaches', duration: 'Last 3 months', order: 'First' },
            { id: 2, complaint: 'Fatigue and low energy', duration: 'Last 6 months', order: 'Second' },
            ],
            historyOfPresentIllness: {
            symptoms: 'Headaches are typically dull, located behind the eyes, and occur 3-4 times a week. Usually start in the afternoon. Fatigue is constant throughout the day, making it hard to concentrate on work.',
            onset: 'gradual',
            duration: 'intermittent',
            frequencyTiming: 'Headaches in afternoon, fatigue is constant',
            progression: 'worsening',
            location: 'Behind the eyes and at the base of the skull',
            radiation: 'Sometimes radiates to the neck and shoulders',
            character: 'Dull, pressure-like',
            severity: 6,
            associatedSymptoms: 'Occasional dizziness, sensitivity to light during headaches.',
            aggravatingFactors: 'Long hours on the computer, lack of sleep, stress.',
            relievingFactors: 'Resting in a dark room, caffeine.',
            previousEpisodes: 'Had similar but milder headaches during a stressful project last year.',
            impact: 'Affects work productivity and mood.',
            },
            pastHistory: {
            conditions: [
                { id: 1, condition: 'Tonsillectomy', date: '1995-05-10', cured: true },
                { id: 2, condition: 'Gallbladder removal (Laparoscopic cholecystectomy)', date: '2018-11-02', cured: true },
            ],
            trauma: 'Minor car accident in 2010, resulting in whiplash. Fully recovered.',
            bloodTransfusions: 'None',
            allergies: 'Penicillin (causes rash), seasonal pollen (hay fever).',
            immunizations: 'Up-to-date with all adult immunizations, including annual flu shot.',
            },
            medications: {
            prescribed: [
                { id: 1, name: 'Ibuprofen', dosage: '400mg, as needed for headaches', description: 'For pain relief' },
            ],
            supplements: 'Vitamin D (2000 IU/day), Iron (as recommended by previous doctor).',
            compliance: 'good',
            recentChanges: 'Started taking iron supplements 2 months ago.',
            },
            familyHistory: {
            conditions: ['Hypertension', 'Diabetes Type 1/2'],
            familyHealthStatus: 'Mother (68) has hypothyroidism and hypertension. Father (70) has Type 2 Diabetes. One older brother (45) is healthy.',
            consanguinity: 'no',
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
            quality: 'fair',
            issues: ['Frequent awakening'],
            dreamFrequency: 'sometimes',
            notes: 'Often wake up around 3 AM and find it hard to fall back asleep.',
            photo: null,
            },
            diet: {
            dietType: 'omnivore',
            waterIntake: 2,
            hungerLevel: 6,
            favoriteFood: 'Pasta and salads',
            foodAllergies: 'None known',
            tastes: {
                sweet: true,
                sour: false,
                salty: true,
                bitter: false,
                pungent: false,
                astringent: false,
            },
            thirstLevel: 'normal',
            notes: 'Tries to eat healthy but often gets cravings for salty snacks in the evening.',
            photo: null,
            },
            activity: {
            level: 'lightly',
            notes: 'Goes for a 30-minute walk 2-3 times a week.',
            photo: null,
            },
            stress: {
            level: 'high',
            caffeineIntake: 'moderate',
            primaryEmotion: 'anxious',
            emotionNotes: 'Feeling overwhelmed with work deadlines.',
            notes: 'Feels a lot of pressure from her job.',
            photo: null,
            },
            substance: {
            smokingStatus: 'never',
            alcoholConsumption: 'occasionally',
            notes: 'Has a glass of wine 2-3 times a week to unwind.',
            photo: null,
            },
            stool: {
            color: 'Brown',
            type: '3',
            problems: ['Constipation'],
            notes: 'Sometimes goes 2-3 days without a bowel movement.',
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
            lastPeriodDate: '2024-06-25',
            cycleLength: 29,
            duration: 4,
            isRegular: 'yes',
            flow: 'medium',
            bloodColor: 'Dark Red',
            symptoms: ['Cramps', 'Bloating'],
            painLevel: 5,
            notes: 'Cramps are usually worse on the first day.',
            photo: null,
            },
        },
        patientImprovementReview: [
            {
                id: 1,
                symptom: 'Lower back pain after starting new exercise routine',
                date: '2024-05-20',
                doctorName: 'Dr. Miller',
                review: 4,
                status: 'relieved',
                recoveryPercentage: 80,
            }
        ],
        consultation: {
            doctors: [
                { id: 1, name: 'Dr. Evelyn Reed', specialization: 'Cardiologist', avatar: 'https://placehold.co/100x100.png' },
                { id: 2, name: 'Dr. Ben Carter', specialization: 'Neurologist', avatar: 'https://placehold.co/100x100.png' },
                { id: 3, name: 'Dr. Olivia Chen', specialization: 'Dermatologist', avatar: 'https://placehold.co/100x100.png' },
            ],
            booking: {
                patientName: 'Jane Smith',
                problem: '',
                report: null,
                uniqueId: '',
                doctorId: null,
            }
        }
    }
};

export const getPatientData = (patientId: string): HealthData => {
    if (!patientDB[patientId]) {
        // If patient doesn't exist, create a new record for them.
        console.log(`Creating new data for patientId: ${patientId}`);
        patientDB[patientId] = JSON.parse(JSON.stringify(initialHealthData));
    }
    return patientDB[patientId];
};

export const savePatientData = (patientId: string, data: HealthData): HealthData => {
    console.log(`Saving data for patientId: ${patientId}`);
    patientDB[patientId] = data;
    return patientDB[patientId];
};
