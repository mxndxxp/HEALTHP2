
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
  occupation: string;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed' | '';
  dateOfVisit: string;
  referredBy: string;
};

export type PastCondition = {
  id: number;
  condition: string; // Also used for Hospitalizations/surgeries
  date: string;
  cured: boolean;
};

export type CurrentMedication = {
  id: number;
  name: string;
  dosage: string;
  description: string;
};

export type ChiefComplaint = {
  id: number;
  complaint: string;
  duration: string;
  order: string;
};

export type MedicalHistoryInfo = {
  chiefComplaints: ChiefComplaint[];
  historyOfPresentIllness: {
    symptoms: string;
    onset: 'sudden' | 'gradual' | '';
    duration: 'continuous' | 'intermittent' | '';
    frequencyTiming: string;
    progression: 'improving' | 'worsening' | 'static' | '';
    location: string;
    radiation: string;
    character: string;
    severity: number;
    associatedSymptoms: string;
    aggravatingFactors: string;
    relievingFactors: string;
    previousEpisodes: string;
    impact: string;
  };
  pastHistory: {
    conditions: PastCondition[];
    trauma: string;
    bloodTransfusions: string;
    allergies: string;
    immunizations: string;
  };
  medications: {
    prescribed: CurrentMedication[];
    supplements: string;
    compliance: 'good' | 'fair' | 'poor' | '';
    recentChanges: string;
  };
  familyHistory: {
    conditions: string[];
    familyHealthStatus: string;
    consanguinity: 'yes' | 'no' | 'unknown' | '';
  };
  documents: {
    reports: string | null;
    prescriptions: string | null;
    photos: string | null;
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

export type PatientImprovementReviewItem = {
  id: number;
  symptom: string;
  date: string;
  doctorName: string;
  review: number; // 0-5
  status: 'relieved' | 'not-relieved' | '';
  recoveryPercentage: number; // 0-100
};

export type Doctor = {
  id: number;
  name: string;
  specialization: string;
  avatar: string;
};

export type Booking = {
  patientName: string;
  problem: string;
  report: File | null;
  uniqueId: string;
  doctorId: number | null;
};

export type HealthData = {
  id?: string;
  patientInfo: PatientInfo;
  medicalHistory: MedicalHistoryInfo;
  lifestyleAssessment: LifestyleAssessmentInfo;
  patientImprovementReview: PatientImprovementReviewItem[];
  consultation: {
    doctors: Doctor[];
    booking: Booking;
  };
}
