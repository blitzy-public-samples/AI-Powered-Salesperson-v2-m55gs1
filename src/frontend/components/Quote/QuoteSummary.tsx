import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentQuote } from '@/store/quoteSlice';
import { Quote } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Card } from '@/components/UI/Card';
import { Badge } from '@/components/UI/Badge';
import styles from '@/styles/QuoteSummary.module.css';

// Helper function to render customer information
const renderCustomerInfo = (quote: Quote): JSX.Element => {
  const { customer } = quote;
  return (
    <div className={styles.customerInfo}>
      <h3>{customer.name}</h3>
      {customer.company && <p>{customer.company}</p>}
      <p>{customer.email}</p>
      {customer.phone && <p>{customer.phone}</p>}
    </div>
  );
};

// Main QuoteSummary component
const QuoteSummary: React.FC = () => {
  // Fetch current quote data from Redux store
  const quote = useSelector(selectCurrentQuote);

  if (!quote) {
    return <div>No quote available</div>;
  }

  return (
    <Card className={styles.quoteSummary}>
      <div className={styles.header}>
        <h2>Quote Summary</h2>
        <Badge variant={quote.status.toLowerCase()}>{quote.status}</Badge>
      </div>

      <div className={styles.details}>
        <div className={styles.row}>
          <span>Quote Number:</span>
          <span>{quote.quoteNumber}</span>
        </div>
        <div className={styles.row}>
          <span>Created On:</span>
          <span>{formatDate(quote.createdAt)}</span>
        </div>
        <div className={styles.row}>
          <span>Expires On:</span>
          <span>{formatDate(quote.expiresAt)}</span>
        </div>
        <div className={styles.row}>
          <span>Total Amount:</span>
          <span className={styles.totalAmount}>{formatCurrency(quote.totalAmount)}</span>
        </div>
        <div className={styles.row}>
          <span>Items:</span>
          <span>{quote.items.length}</span>
        </div>
      </div>

      <div className={styles.customerSection}>
        <h3>Customer Information</h3>
        {renderCustomerInfo(quote)}
      </div>
    </Card>
  );
};

export default QuoteSummary;

// Human tasks:
// TODO: Design and implement a visually appealing layout for the quote summary
// TODO: Add hover effects or tooltips for additional information
// TODO: Implement responsive design for various screen sizes