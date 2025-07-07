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
    hungerLevel: number;
    favoriteFood: string;
};

export type HealthData = {
  patientInfo: PatientInfo;
  medicalHistory: MedicalHistoryInfo;
  lifestyleAssessment: LifestyleAssessmentInfo;
  // Other sections would be added here
}
