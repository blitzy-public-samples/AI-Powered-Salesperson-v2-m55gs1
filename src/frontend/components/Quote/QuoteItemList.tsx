import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentQuote } from '@/store/quoteSlice';
import { QuoteItem } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { Table } from '@/components/UI/Table';
import { Button } from '@/components/UI/Button';
import styles from '@/styles/QuoteItemList.module.css';

const QuoteItemList: React.FC = () => {
  // Fetch current quote data from Redux store
  const quote = useSelector(selectCurrentQuote);
  const items = quote?.items || [];

  // Define table columns configuration
  const columns = [
    { header: 'SKU', accessor: 'sku' },
    { header: 'Description', accessor: 'description' },
    { header: 'Quantity', accessor: 'quantity' },
    { header: 'Unit Price', accessor: 'unitPrice' },
    { header: 'Total', accessor: 'total' },
    { header: 'Actions', accessor: 'actions' },
  ];

  // Helper function to render a single item row
  const renderItemRow = (item: QuoteItem) => {
    const { sku, description, quantity, unitPrice } = item;
    const total = quantity * unitPrice;

    return (
      <tr key={sku}>
        <td>{sku}</td>
        <td>{description}</td>
        <td>{quantity}</td>
        <td>{formatCurrency(unitPrice)}</td>
        <td>{formatCurrency(total)}</td>
        <td>
          <Button onClick={() => {/* Implement edit functionality */}}>Edit</Button>
          <Button onClick={() => {/* Implement remove functionality */}}>Remove</Button>
        </td>
      </tr>
    );
  };

  // Calculate total price of all items
  const totalPrice = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  // Handler for adding a new item to the quote
  const handleAddItem = () => {
    // Dispatch action to add new item to quote
    // Open item edit modal or form
  };

  return (
    <div className={styles.quoteItemList}>
      <Table columns={columns}>
        {items.map(renderItemRow)}
        <tr className={styles.totalRow}>
          <td colSpan={4}>Total</td>
          <td>{formatCurrency(totalPrice)}</td>
          <td></td>
        </tr>
      </Table>
      <Button onClick={handleAddItem} className={styles.addItemButton}>Add Item</Button>
    </div>
  );
};

export default QuoteItemList;

// Human tasks:
// TODO: Implement drag-and-drop functionality for reordering items
// TODO: Add inline editing capabilities for quick updates
// TODO: Implement pagination or virtualization for handling large numbers of items