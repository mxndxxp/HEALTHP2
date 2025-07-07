export type PatientInfo = {
  name: string;
  age: string;
  gender: 'male' | 'female' | 'non-binary' | '';
  email: string;
  phone: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    district: string;
    state: string;
    postalCode: string;
  };
  height: string;
  weight: string;
  uniqueId: string;
  avatar: string;
  dob: string;
  birthTime: string;
  birthPlace: string;
  deliveryType: 'normal' | 'c-section' | 'forceps' | 'vacuum';
  deliveryTime: string;
};

export type PastCondition = {
  id: number;
  condition: string;
  date: string;
  cured: boolean;
};

export type CurrentMedication = {
  id: number;
  name: string;
  dosage: string;
  description: string;
};

export type MedicalHistoryInfo = {
  familyHistory: string[];
  pastHistory: PastCondition[];
  currentSituation: {
    symptoms: string;
    severity: number;
    impact: string;
  };
  medications: CurrentMedication[];
  documents: {
    reports: File | null;
    prescriptions: File | null;
    photos: File | null;
  };
};

export type LifestyleAssessmentInfo = {
  sleep: {
    bedtime: string;
    wakeTime: string;
    quality: 'excellent' | 'good' | 'fair' | 'poor' | '';
    issues: string[];
    dreamFrequency: 'never' | 'sometimes' | 'often' | 'vivid' | '';
    notes: string;
    photo: File | null;
  };
  diet: {
    dietType: 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | '';
    waterIntake: number;
    hungerLevel: number;
    favoriteFood: string;
    foodAllergies: string;
    tastes: {
      sweet: boolean;
      sour: boolean;
      salty: boolean;
      bitter: boolean;
      pungent: boolean;
      astringent: boolean;
    };
    thirstLevel: 'low' | 'normal' | 'high' | '';
    notes: string;
    photo: File | null;
  };
  activity: {
    level: 'sedentary' | 'lightly' | 'moderately' | 'very' | '';
    notes: string;
    photo: File | null;
  };
  stress: {
    level: 'low' | 'moderate' | 'high' | 'very-high' | '';
    caffeineIntake: 'none' | 'low' | 'moderate' | 'high' | 'excessive' | '';
    primaryEmotion: 'happy' | 'sad' | 'anxious' | 'angry' | 'calm' | 'other' | '';
    emotionNotes: string;
    notes: string;
    photo: File | null;
  };
  substance: {
    smokingStatus: 'never' | 'former' | 'occasional' | 'regular' | '';
    alcoholConsumption: 'never' | 'rarely' | 'occasionally' | 'weekly' | 'daily' | '';
    notes: string;
    photo: File | null;
  };
  stool: {
    color: string;
    type: string;
    problems: string[];
    notes: string;
    photo: File | null;
  };
  urine: {
    color: string;
    dayFrequency: 'normal' | 'frequent' | 'infrequent' | '';
    nightFrequency: '0-1' | '2-3' | '4+' | '';
    problems: string[];
    notes: string;
    photo: File | null;
  };
  menstruation: {
    lastPeriodDate: string;
    cycleLength: number;
    duration: number;
    isRegular: 'yes' | 'no' | 'na';
    flow: 'light' | 'medium' | 'heavy' | '';
    bloodColor: string;
    symptoms: string[];
    painLevel: number;
    notes: string;
    photo: File | null;
  };
};

export type HealthData = {
  patientInfo: PatientInfo;
  medicalHistory: MedicalHistoryInfo;
  lifestyleAssessment: LifestyleAssessmentInfo;
  // Other sections would be added here
}
