import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentQuote, editQuote, sendQuote, exportQuote } from '@/store/quoteSlice';
import { Quote } from '@/types';
import { Button } from '@/components/UI/Button';
import { Modal } from '@/components/UI/Modal';
import { quoteApi } from '@/services/api';
import { generateQuotePDF } from '@/utils/pdfGenerator';
import styles from '@/styles/QuoteActions.module.css';

const QuoteActions: React.FC = () => {
  const dispatch = useDispatch();
  const currentQuote = useSelector(selectCurrentQuote);
  const [showSendModal, setShowSendModal] = useState(false);

  // Handler for editing the current quote
  const handleEdit = () => {
    dispatch(editQuote(currentQuote.id));
    // TODO: Navigate to quote edit page or open edit modal
  };

  // Handler for sending the quote to the customer
  const handleSend = async () => {
    try {
      const response = await quoteApi.sendQuote(currentQuote.id);
      dispatch(sendQuote(response));
      setShowSendModal(false);
      // TODO: Show success message to user
    } catch (error) {
      // TODO: Implement proper error handling
      console.error('Error sending quote:', error);
    }
  };

  // Handler for exporting the quote as PDF
  const handleExport = async () => {
    try {
      const pdfBlob = await generateQuotePDF(currentQuote);
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `Quote_${currentQuote.id}.pdf`;
      link.click();
      URL.revokeObjectURL(pdfUrl);
      dispatch(exportQuote(currentQuote.id));
      // TODO: Show success message to user
    } catch (error) {
      // TODO: Implement proper error handling
      console.error('Error exporting quote:', error);
    }
  };

  return (
    <div className={styles.quoteActions}>
      <Button onClick={handleEdit} className={styles.editButton}>
        Edit Quote
      </Button>
      <Button onClick={() => setShowSendModal(true)} className={styles.sendButton}>
        Send Quote
      </Button>
      <Button onClick={handleExport} className={styles.exportButton}>
        Export as PDF
      </Button>

      <Modal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        title="Send Quote"
      >
        <p>Are you sure you want to send this quote to the customer?</p>
        <div className={styles.modalActions}>
          <Button onClick={() => setShowSendModal(false)}>Cancel</Button>
          <Button onClick={handleSend} className={styles.confirmButton}>
            Confirm
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default QuoteActions;

// TODO: Human tasks
// - Implement proper error handling for API calls
// - Add loading indicators for asynchronous actions
// - Implement user feedback mechanisms (e.g., success/error toasts)