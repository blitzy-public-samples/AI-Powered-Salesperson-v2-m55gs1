import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectMessages } from '@/store/chatSlice';
import { Message } from '@/types';
import { formatTimestamp } from '@/utils/formatters';
import { MessageItem } from '@/components/Chat/MessageItem';

const MessageList: React.FC = () => {
  // Create a ref for the message container
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Fetch messages from Redux store using useSelector
  const messages = useSelector(selectMessages);

  // Function to scroll the message container to the bottom
  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  // Set up effect to scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="message-list-container" ref={messageContainerRef}>
      {/* Render list of MessageItem components */}
      {messages.map((message: Message, index: number) => (
        <MessageItem
          key={message.id}
          message={message}
          timestamp={formatTimestamp(message.timestamp)}
          isConsecutive={
            index > 0 && messages[index - 1].sender === message.sender
          }
        />
      ))}
    </div>
  );
};

export default MessageList;

// Human tasks:
// TODO: Implement message grouping for consecutive messages from the same sender
// TODO: Add support for rendering different message types (text, image, file)
// TODO: Implement lazy loading for large message histories