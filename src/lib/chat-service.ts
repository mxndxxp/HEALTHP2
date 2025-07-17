import { db } from './firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, onSnapshot, Unsubscribe } from 'firebase/firestore';

export type Message = {
    id: string;
    text: string;
    sender: 'patient' | 'doctor';
    timestamp: any; // Firestore timestamp object or serverTimestamp()
};

// The chat ID is a composite key of the doctor and patient IDs.
// This ensures a unique chat room for each doctor-patient pair.
export const getChatId = (doctorId: string, patientId: string) => {
    // Sort to ensure consistency regardless of who starts the chat
    const ids = [doctorId, patientId].sort();
    return `chat_d${ids[0]}_p${ids[1]}`;
};

export const getChatHistory = async (chatId: string): Promise<Message[]> => {
    const messagesCol = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesCol, orderBy('timestamp', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const messages: Message[] = [];
    querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() } as Message);
    });
    
    return messages;
};

export const addMessageToHistory = async (chatId: string, message: Omit<Message, 'id' | 'timestamp'>): Promise<Message> => {
    const messagesCol = collection(db, 'chats', chatId, 'messages');
    const docRef = await addDoc(messagesCol, {
        ...message,
        timestamp: serverTimestamp(),
    });
    return {
        ...message,
        id: docRef.id,
        timestamp: new Date() // Return a client-side timestamp for immediate use
    };
};

export const subscribeToChat = (chatId: string, callback: (messages: Message[]) => void): Unsubscribe => {
    const messagesCol = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesCol, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages: Message[] = [];
        querySnapshot.forEach((doc) => {
            messages.push({ id: doc.id, ...doc.data() } as Message);
        });
        callback(messages);
    }, (error) => {
        console.error("Error listening to chat updates: ", error);
    });

    return unsubscribe;
};
