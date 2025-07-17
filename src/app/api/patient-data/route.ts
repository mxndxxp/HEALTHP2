import { NextResponse } from 'next/server';
import { savePatientData } from '@/lib/patient-data-service';
import type { HealthData } from '@/lib/types';

// POST handler to save patient data to Firestore
export async function POST(request: Request) {
     try {
        const body = await request.json();
        const { patientId, data } = body as { patientId: string, data: HealthData };

        if (!patientId || !data) {
            return new NextResponse('Missing patientId or data payload', { status: 400 });
        }
        
        const updatedData = await savePatientData(patientId, data);
        return NextResponse.json(updatedData);
    } catch (error) {
        console.error('Error saving patient data:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
