import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentChat, sendMessage, startNewChat } from '@/store/chatSlice';
import { selectUser } from '@/store/userSlice';
import { ChatLayout } from '@/components/Layout/ChatLayout';
import { ChatWindow } from '@/components/Chat/ChatWindow';
import { InputArea } from '@/components/Chat/InputArea';
import { AITypingIndicator } from '@/components/Chat/AITypingIndicator';
import { Sidebar } from '@/components/UI/Sidebar';
import { Button } from '@/components/UI/Button';
import { initializeWebSocket } from '@/services/chatService';
import { trackChatInteraction } from '@/utils/analytics';
import styles from '@/styles/Chat.module.css';

const ChatPage: React.FC = () => {
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);
  const [isAITyping, setIsAITyping] = useState(false);
  const currentChat = useSelector(selectCurrentChat);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  // Initialize WebSocket connection on component mount
  useEffect(() => {
    const ws = initializeWebSocket();
    setWsConnection(ws);

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  // Track chat interactions for analytics
  useEffect(() => {
    if (currentChat) {
      trackChatInteraction('view_chat', { chatId: currentChat.id });
    }
  }, [currentChat]);

  const handleSendMessage = async (message: string) => {
    try {
      await dispatch(sendMessage({ message, chatId: currentChat?.id }));
      // Update local state to show message immediately
      // This part would be handled by the ChatWindow component
      trackChatInteraction('send_message', { chatId: currentChat?.id });
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleStartNewChat = async () => {
    try {
      await dispatch(startNewChat());
      // Reset local state for the chat interface
      setIsAITyping(false);
      trackChatInteraction('start_new_chat');
    } catch (error) {
      console.error('Error starting new chat:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <ChatLayout>
      <Sidebar>
        {/* Add chat history or context here */}
        <Button onClick={handleStartNewChat}>Start New Chat</Button>
      </Sidebar>
      <div className={styles.chatContainer}>
        <ChatWindow messages={currentChat?.messages || []} />
        {isAITyping && <AITypingIndicator />}
        <InputArea onSendMessage={handleSendMessage} />
      </div>
    </ChatLayout>
  );
};

export default ChatPage;

// Human tasks:
// TODO: Implement real-time updates for chat messages using WebSocket
// TODO: Add error handling for WebSocket connection issues
// TODO: Implement chat context preservation for page refreshes or navigation