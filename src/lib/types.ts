export type PatientData = {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'non-binary';
  email: string;
  phone: string;
  address: string;
  height: number;
  weight: number;
  uniqueId: string;
};

export interface HealthData {
  patientInfo: PatientData;
  // Other sections would be added here
}
