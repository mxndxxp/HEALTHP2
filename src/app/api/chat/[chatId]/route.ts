import { NextResponse } from 'next/server';
import { getChatHistory, addMessageToHistory } from '@/lib/chat-service';

type ChatParams = {
    params: {
        chatId: string;
    }
}

// GET handler to fetch chat history from Firestore
export async function GET(request: Request, { params }: ChatParams) {
    try {
        const { chatId } = params;
        const history = await getChatHistory(chatId);
        return NextResponse.json(history);
    } catch (error) {
        console.error('Error fetching chat history:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}


// POST handler to add a new message to Firestore
export async function POST(request: Request, { params }: ChatParams) {
     try {
        const { chatId } = params;
        const body = await request.json();
        const { text, sender } = body;

        if (!text || !sender) {
            return new NextResponse('Missing message text or sender', { status: 400 });
        }
        
        const newMessage = await addMessageToHistory(chatId, { text, sender });
        return NextResponse.json(newMessage);
    } catch (error) {
        console.error('Error posting message:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
