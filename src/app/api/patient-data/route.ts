import { NextResponse } from 'next/server';
import { getPatientData, savePatientData } from '@/lib/patient-data-service';
import type { HealthData } from '@/lib/types';

// GET handler to fetch patient data from Firestore
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const patientId = searchParams.get('patientId');

        if (!patientId) {
            return new NextResponse('Patient ID is required', { status: 400 });
        }
        
        const data = await getPatientData(patientId);
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error fetching patient data:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}


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
