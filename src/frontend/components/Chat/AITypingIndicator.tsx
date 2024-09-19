import React from 'react';
import { useSelector } from 'react-redux';
import { selectAITypingStatus } from '@/store/chatSlice';
import { Icon } from '@/components/UI/Icon';
import styles from '@/styles/AITypingIndicator.module.css';

const AITypingIndicator: React.FC = () => {
  // Fetch AI typing status from Redux store
  const isAITyping = useSelector(selectAITypingStatus);

  if (!isAITyping) {
    return null;
  }

  return (
    <div className={styles.aiTypingIndicator} aria-live="polite">
      <Icon name="robot" className={styles.aiIcon} />
      <span className={styles.aiTypingText}>AI is typing</span>
      <div className={styles.dotContainer}>
        <span className={`${styles.dot} ${styles.dot1}`}>.</span>
        <span className={`${styles.dot} ${styles.dot2}`}>.</span>
        <span className={`${styles.dot} ${styles.dot3}`}>.</span>
      </div>
    </div>
  );
};

export default AITypingIndicator;

// Human tasks:
// TODO: Design and implement custom animation for typing indicator
// TODO: Add accessibility features for screen readers
// TODO: Implement fallback for browsers that don't support CSS animations