// This is a simple in-memory "database" for the chat prototype.
// In a real application, you would use a proper database like Firestore.

type Message = {
    id: string;
    text: string;
    sender: 'patient' | 'doctor';
    timestamp: number;
};

type ChatHistory = {
    [chatId: string]: Message[];
};

// Seed initial data to simulate existing conversations.
const chatDB: ChatHistory = {
    'doctor-1-patient-1': [
        { id: '1', text: "Hello Jane, this is your doctor. How are you feeling today?", sender: 'doctor', timestamp: Date.now() - 200000 },
        { id: '2', text: "Hi Doctor, I'm feeling a bit better, thank you for asking.", sender: 'patient', timestamp: Date.now() - 100000 },
    ],
    'doctor-2-patient-2': [
        { id: '3', text: "Hello Robert, checking in on your progress.", sender: 'doctor', timestamp: Date.now() - 500000 }
    ],
    // Add more initial chats as needed
};

// The chat ID is a composite key of the doctor and patient IDs.
// This ensures a unique chat room for each doctor-patient pair.
export const getChatId = (doctorId: string, patientId: string) => {
    return `doctor-${doctorId}-patient-${patientId}`;
};

export const getChatHistory = (chatId: string): Message[] => {
    if (!chatDB[chatId]) {
        chatDB[chatId] = []; // Start a new chat if one doesn't exist
    }
    return chatDB[chatId].sort((a, b) => a.timestamp - b.timestamp);
};

export const addMessageToHistory = (chatId: string, message: Omit<Message, 'id' | 'timestamp'>): Message => {
    if (!chatDB[chatId]) {
        chatDB[chatId] = [];
    }
    const newMessage: Message = {
        ...message,
        id: (Date.now() + Math.random()).toString(),
        timestamp: Date.now(),
    };
    chatDB[chatId].push(newMessage);
    return newMessage;
};
