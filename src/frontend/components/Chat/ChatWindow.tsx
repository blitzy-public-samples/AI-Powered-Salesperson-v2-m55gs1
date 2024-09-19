import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MessageList from '@/components/Chat/MessageList';
import InputArea from '@/components/Chat/InputArea';
import AITypingIndicator from '@/components/Chat/AITypingIndicator';
import { sendMessage, startNewSession } from '@/store/chatSlice';
import { chatApi } from '@/services/api';
import { formatChatMessage } from '@/utils/formatters';

const ChatWindow: React.FC = () => {
  // Initialize state for messages and AI typing status
  const [messages, setMessages] = useState<Array<any>>([]);
  const [isAITyping, setIsAITyping] = useState(false);

  // Fetch chat history from Redux store
  const chatHistory = useSelector((state: any) => state.chat.messages);
  const dispatch = useDispatch();

  // Set up effect to start a new chat session on component mount
  useEffect(() => {
    dispatch(startNewSession());
  }, [dispatch]);

  // Set up effect to handle incoming messages from WebSocket
  useEffect(() => {
    // TODO: Implement WebSocket connection for real-time messaging
    // This is a placeholder for the WebSocket implementation
    const ws = new WebSocket('ws://your-websocket-url');

    ws.onmessage = (event) => {
      const incomingMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, incomingMessage]);
      setIsAITyping(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  // Define handler for sending messages
  const handleSendMessage = async (message: string) => {
    // Format the outgoing message
    const formattedMessage = formatChatMessage(message, 'user');

    // Dispatch sendMessage action to update Redux store
    dispatch(sendMessage(formattedMessage));

    // Update local state to show message immediately
    setMessages((prevMessages) => [...prevMessages, formattedMessage]);

    // Send message to backend API
    try {
      setIsAITyping(true);
      await chatApi.sendMessage(message);
    } catch (error) {
      // TODO: Add error handling for API calls
      console.error('Error sending message:', error);
      setIsAITyping(false);
    }
  };

  return (
    <div className="chat-window">
      <MessageList messages={messages} />
      <AITypingIndicator isTyping={isAITyping} />
      <InputArea onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatWindow;

// TODO: Human tasks
// 1. Implement WebSocket connection for real-time messaging
// 2. Add error handling for API calls and WebSocket connection
// 3. Implement message persistence in case of connection loss