import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { selectCurrentQuote, fetchQuote, updateQuote, sendQuote } from '@/store/quoteSlice';
import { selectUser } from '@/store/userSlice';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { QuoteSummary } from '@/components/Quote/QuoteSummary';
import { QuoteItemList } from '@/components/Quote/QuoteItemList';
import { QuoteActions } from '@/components/Quote/QuoteActions';
import { Button } from '@/components/UI/Button';
import { Modal } from '@/components/UI/Modal';
import { generateQuotePDF } from '@/services/pdfService';
import { formatCurrency } from '@/utils/formatters';
import { validateQuote } from '@/utils/validators';
import styles from '@/styles/Quote.module.css';

const QuotePage: React.FC = () => {
  const { quoteId } = useParams<{ quoteId: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentQuote = useSelector(selectCurrentQuote);
  const user = useSelector(selectUser);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Fetch quote data on component mount
  useEffect(() => {
    if (quoteId) {
      dispatch(fetchQuote(quoteId));
    }
  }, [quoteId, dispatch]);

  const handleUpdateQuote = async (updatedQuoteData: any) => {
    try {
      // Validate updated quote data
      const validatedData = validateQuote(updatedQuoteData);

      // Dispatch updateQuote action
      await dispatch(updateQuote(validatedData));

      // Show success message
      setModalMessage('Quote updated successfully');
      setIsModalOpen(true);
    } catch (error) {
      // Show error message
      setModalMessage(`Error updating quote: ${error.message}`);
      setIsModalOpen(true);
    }
  };

  const handleSendQuote = async () => {
    try {
      // Show confirmation modal
      setModalMessage('Are you sure you want to send this quote to the customer?');
      setIsModalOpen(true);

      // If confirmed, dispatch sendQuote action
      if (await confirmModal()) {
        await dispatch(sendQuote(currentQuote.id));

        // Show success message
        setModalMessage('Quote sent successfully');
        setIsModalOpen(true);
      }
    } catch (error) {
      // Show error notification
      setModalMessage(`Error sending quote: ${error.message}`);
      setIsModalOpen(true);
    }
  };

  const handleExportQuote = async () => {
    try {
      // Generate PDF
      const pdfBlob = await generateQuotePDF(currentQuote);

      // Trigger download
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Quote_${currentQuote.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Show success message
      setModalMessage('Quote exported successfully');
      setIsModalOpen(true);
    } catch (error) {
      // Show error notification
      setModalMessage(`Error exporting quote: ${error.message}`);
      setIsModalOpen(true);
    }
  };

  const confirmModal = (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Implementation of confirmation modal logic
      // This is a placeholder and should be replaced with actual modal logic
      const confirmed = window.confirm('Are you sure?');
      resolve(confirmed);
    });
  };

  if (!currentQuote) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className={styles.quotePage}>
        <h1 className={styles.pageTitle}>Quote #{currentQuote.id}</h1>
        <QuoteSummary quote={currentQuote} />
        <QuoteItemList items={currentQuote.items} onUpdateItems={handleUpdateQuote} />
        <QuoteActions
          onUpdate={handleUpdateQuote}
          onSend={handleSendQuote}
          onExport={handleExportQuote}
        />
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <p>{modalMessage}</p>
          <Button onClick={() => setIsModalOpen(false)}>Close</Button>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default QuotePage;

// Human tasks:
// TODO: Implement real-time collaboration features for quote editing
// TODO: Add version history and change tracking for quotes
// TODO: Implement advanced pricing rules and discount management