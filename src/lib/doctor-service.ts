import { db } from './firebase';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import type { Doctor } from './types';

export const addDoctor = async (doctorData: Omit<Doctor, 'id' | 'avatar'>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'doctors'), {
        ...doctorData,
        avatar: `https://placehold.co/100x100.png`,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
};

export const getAllDoctors = async (): Promise<Doctor[]> => {
    const doctorsCol = collection(db, 'doctors');
    const doctorSnapshot = await getDocs(doctorsCol);
    const doctorList = doctorSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Doctor));
    return doctorList;
};
