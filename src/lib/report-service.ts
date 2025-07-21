
import { db } from './firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  orderBy,
} from 'firebase/firestore';
import type { Report, ReportInput } from './types';

// Create a new report and submit it for approval
export const createReport = async (reportData: ReportInput): Promise<string> => {
  const reportsCol = collection(db, 'reports');
  const docRef = await addDoc(reportsCol, {
    ...reportData,
    createdAt: serverTimestamp(),
    approvedAt: null, // This will be set on approval
  });
  return docRef.id;
};

// For Admins: Subscribe to all reports to manage them
export const subscribeToReports = (
  callback: (reports: Report[]) => void
): (() => void) => {
  const reportsCol = collection(db, 'reports');
  const q = query(reportsCol, orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const reports: Report[] = [];
      querySnapshot.forEach((doc) => {
        reports.push({ id: doc.id, ...doc.data() } as Report);
      });
      callback(reports);
    },
    (error) => {
      console.error('Error subscribing to reports:', error);
    }
  );

  return unsubscribe;
};

// For Patients: Subscribe to only approved reports for a specific patient
export const subscribeToPatientReports = (
  patientId: string,
  callback: (reports: Report[]) => void,
  onError: (error: Error) => void
): (() => void) => {
  const reportsCol = collection(db, 'reports');
  const q = query(
    reportsCol,
    where('patientId', '==', patientId),
    where('status', '==', 'approved'),
    orderBy('approvedAt', 'desc')
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const reports: Report[] = [];
      querySnapshot.forEach((doc) => {
        reports.push({ id: doc.id, ...doc.data() } as Report);
      });
      callback(reports);
    },
    (error) => {
      console.error(`Error subscribing to reports for patient ${patientId}:`, error);
      onError(error);
    }
  );

  return unsubscribe;
};

// For Admins: Update the status of a report
export const updateReportStatus = async (
  reportId: string,
  status: 'approved' | 'rejected'
): Promise<void> => {
  const reportDocRef = doc(db, 'reports', reportId);
  const updateData: any = { status };
  if (status === 'approved') {
    updateData.approvedAt = serverTimestamp();
  }
  await updateDoc(reportDocRef, updateData);
};
