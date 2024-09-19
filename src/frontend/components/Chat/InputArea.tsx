import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { sendMessage } from '@/store/chatSlice';
import { validateMessage } from '@/utils/validators';
import { Button } from '@/components/UI/Button';
import { Icon } from '@/components/UI/Icon';

interface InputAreaProps {
  onSend: () => void;
}

const InputArea: React.FC<InputAreaProps> = ({ onSend }) => {
  // Initialize state for input value
  const [inputValue, setInputValue] = useState('');
  
  // Create ref for input element
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const dispatch = useDispatch();

  // Set up effect to focus input on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Define handler for input change
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
    
    // Adjust textarea height based on content
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Define handler for sending message
  const handleSendMessage = () => {
    // Validate message content
    if (validateMessage(inputValue)) {
      // Dispatch sendMessage action
      dispatch(sendMessage(inputValue));
      
      // Call onSend prop function
      onSend();
      
      // Clear input value
      setInputValue('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  return (
    <div className="input-area">
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Type your message..."
        rows={1}
      />
      <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
        <Icon name="send" />
        Send
      </Button>
      <Button>
        <Icon name="attachment" />
      </Button>
    </div>
  );
};

export default InputArea;

// Human tasks:
// TODO: Implement file attachment functionality
// TODO: Add support for emoji picker
// TODO: Implement typing indicator when user is typing