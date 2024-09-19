import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatMessage, ChatSession } from '@/types';
import { sendMessageToAI, startNewChatSession } from '@/services/chatService';
import { formatChatMessage } from '@/utils/formatters';

// Define the shape of the chat state
interface ChatState {
  currentChat: ChatSession | null;
  chatHistory: ChatSession[];
  isAITyping: boolean;
}

// Define the initial state
const initialState: ChatState = {
  currentChat: null,
  chatHistory: [],
  isAITyping: false,
};

// Create the chat slice
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Sets the current chat session
    setCurrentChat: (state, action: PayloadAction<ChatSession>) => {
      state.currentChat = action.payload;
    },
    // Adds a new message to the current chat
    addMessageToChat: (state, action: PayloadAction<ChatMessage>) => {
      if (state.currentChat) {
        state.currentChat.messages.push(action.payload);
      }
    },
    // Sets the AI typing status
    setAITyping: (state, action: PayloadAction<boolean>) => {
      state.isAITyping = action.payload;
    },
    // Adds a completed chat session to the history
    addChatToHistory: (state, action: PayloadAction<ChatSession>) => {
      state.chatHistory.push(action.payload);
    },
  },
});

// Export actions
export const { setCurrentChat, addMessageToChat, setAITyping, addChatToHistory } = chatSlice.actions;

// Async thunk for sending a message in the chat
export const sendMessage = (message: string) => async (dispatch: any, getState: any) => {
  try {
    // Format the user message
    const formattedUserMessage = formatChatMessage(message, 'user');
    dispatch(addMessageToChat(formattedUserMessage));

    // Set AI typing status to true
    dispatch(setAITyping(true));

    // Send the message to the AI service
    const aiResponse = await sendMessageToAI(message);

    // Receive and format the AI response
    const formattedAIMessage = formatChatMessage(aiResponse, 'ai');

    // Update the chat state with new messages
    dispatch(addMessageToChat(formattedAIMessage));

    // Set AI typing status to false
    dispatch(setAITyping(false));

    return formattedAIMessage;
  } catch (error) {
    console.error('Error sending message:', error);
    dispatch(setAITyping(false));
    throw error;
  }
};

// Async thunk for starting a new chat session
export const startNewChat = () => async (dispatch: any) => {
  try {
    // Call the service to start a new chat session
    const newSession = await startNewChatSession();

    // Update the chat state with the new session
    dispatch(setCurrentChat(newSession));

    return newSession;
  } catch (error) {
    console.error('Error starting new chat:', error);
    throw error;
  }
};

// Selectors
export const selectCurrentChat = (state: RootState) => state.chat.currentChat;
export const selectChatHistory = (state: RootState) => state.chat.chatHistory;
export const selectIsAITyping = (state: RootState) => state.chat.isAITyping;

export default chatSlice.reducer;