import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '@/store/adminSlice';
import { DashboardData } from '@/types';
import Card from '@/components/UI/Card';
import Chart from '@/components/UI/Chart';
import SystemStats from '@/components/Admin/SystemStats';
import QuoteOverview from '@/components/Admin/QuoteOverview';
import UserActivity from '@/components/Admin/UserActivity';
import { formatNumber, formatCurrency } from '@/utils/formatters';
import styles from '@/styles/AdminDashboard.module.css';

const AdminDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dashboardData = useSelector((state: any) => state.admin.dashboardData);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch dashboard data on component mount
    dispatch(fetchDashboardData());
    setIsLoading(false);
  }, [dispatch]);

  const renderMetricCard = (title: string, value: number, icon: string, trend: string) => {
    return (
      <Card className={styles.metricCard}>
        <h3>{title}</h3>
        <div className={styles.metricValue}>
          {title.toLowerCase().includes('revenue') ? formatCurrency(value) : formatNumber(value)}
        </div>
        <div className={styles.metricIcon}>{icon}</div>
        <div className={styles.metricTrend}>{trend}</div>
      </Card>
    );
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading dashboard data...</div>;
  }

  return (
    <div className={styles.adminDashboard}>
      <h1>Admin Dashboard</h1>
      
      {/* Render key metrics cards */}
      <div className={styles.metricsGrid}>
        {renderMetricCard('Total Users', dashboardData.totalUsers, '👥', '+5%')}
        {renderMetricCard('Active Chats', dashboardData.activeChats, '💬', '+12%')}
        {renderMetricCard('Quotes Generated', dashboardData.quotesGenerated, '📄', '+8%')}
        {renderMetricCard('Revenue', dashboardData.revenue, '💰', '+15%')}
      </div>

      {/* Render system statistics */}
      <SystemStats stats={dashboardData.systemStats} />

      {/* Render quote overview */}
      <QuoteOverview quoteData={dashboardData.quoteOverview} />

      {/* Render user activity */}
      <UserActivity activityData={dashboardData.userActivity} />

      {/* Render charts for visualizing trends */}
      <div className={styles.chartsGrid}>
        <Chart
          title="User Growth"
          data={dashboardData.userGrowthData}
          type="line"
          className={styles.chart}
        />
        <Chart
          title="Revenue Trend"
          data={dashboardData.revenueTrendData}
          type="bar"
          className={styles.chart}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;

// Human tasks:
// TODO: Design and implement responsive layout for various screen sizes
// TODO: Add data refresh functionality with a user-controlled interval
// TODO: Implement error handling and display for data fetching issues