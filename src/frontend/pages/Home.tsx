import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '@/store/userSlice';
import { selectRecentChats } from '@/store/chatSlice';
import { selectRecentQuotes } from '@/store/quoteSlice';
import { DashboardLayout } from '@/components/Layout/Dashboard';
import { Card } from '@/components/UI/Card';
import { Button } from '@/components/UI/Button';
import { RecentChatsList } from '@/components/Chat/RecentChatsList';
import { RecentQuotesList } from '@/components/Quote/RecentQuotesList';
import { trackPageView } from '@/utils/analytics';
import styles from '@/styles/Home.module.css';

const HomePage: React.FC = () => {
  // Fetch user data from Redux store
  const user = useSelector(selectUser);
  // Fetch recent chats data from Redux store
  const recentChats = useSelector(selectRecentChats);
  // Fetch recent quotes data from Redux store
  const recentQuotes = useSelector(selectRecentQuotes);

  // Track page view
  useEffect(() => {
    trackPageView('Home');
  }, []);

  return (
    <DashboardLayout>
      <div className={styles.homeContainer}>
        {renderWelcomeSection(user.name)}
        {renderQuickActions()}
        <div className={styles.listsContainer}>
          <RecentChatsList chats={recentChats} />
          <RecentQuotesList quotes={recentQuotes} />
        </div>
        {renderPerformanceMetrics(user.metrics)}
      </div>
    </DashboardLayout>
  );
};

const renderWelcomeSection = (userName: string): JSX.Element => {
  return (
    <Card className={styles.welcomeCard}>
      <h1 className={styles.welcomeTitle}>Welcome back, {userName}!</h1>
      <p className={styles.welcomeDate}>{new Date().toLocaleDateString()}</p>
      {/* Add system notifications or updates here if available */}
    </Card>
  );
};

const renderQuickActions = (): JSX.Element => {
  return (
    <div className={styles.quickActions}>
      <Button onClick={() => { /* Navigate to new chat page */ }}>New Chat</Button>
      <Button onClick={() => { /* Navigate to new quote page */ }}>New Quote</Button>
    </div>
  );
};

const renderPerformanceMetrics = (metrics: any): JSX.Element => {
  return (
    <div className={styles.metricsContainer}>
      {Object.entries(metrics).map(([key, value]) => (
        <Card key={key} className={styles.metricCard}>
          <h3 className={styles.metricLabel}>{key}</h3>
          <p className={styles.metricValue}>{value}</p>
          {/* Add trend indicator here if applicable */}
          {/* Add tooltip or info icon for metric explanation */}
        </Card>
      ))}
    </div>
  );
};

export default HomePage;

// Human tasks:
// TODO: Design an engaging and intuitive layout for the home page
// TODO: Implement responsive design for various screen sizes
// TODO: Add animations or transitions for a polished user experience