import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSystemStats } from '@/store/adminSlice';
import { SystemStats } from '@/types';
import { Card } from '@/components/UI/Card';
import { Chart } from '@/components/UI/Chart';
import { Table } from '@/components/UI/Table';
import { Tabs, TabPane } from '@/components/UI/Tabs';
import { formatNumber, formatPercentage, formatDate } from '@/utils/formatters';
import styles from '@/styles/SystemStats.module.css';

const SystemStatsComponent: React.FC = () => {
  // Initialize state for selected time range
  const [timeRange, setTimeRange] = useState('24h');

  // Fetch system stats from Redux store using useSelector
  const stats = useSelector((state: any) => state.admin.systemStats);
  const dispatch = useDispatch();

  // Use useEffect to dispatch fetchSystemStats action on component mount and time range change
  useEffect(() => {
    dispatch(fetchSystemStats(timeRange));
  }, [dispatch, timeRange]);

  // Render Tabs component for different stat categories
  return (
    <div className={styles.systemStats}>
      <h1>System Statistics</h1>
      <Tabs>
        <TabPane tab="Performance" key="performance">
          {renderPerformanceStats(stats)}
        </TabPane>
        <TabPane tab="Usage" key="usage">
          {renderUsageStats(stats)}
        </TabPane>
        <TabPane tab="AI Model" key="aiModel">
          {renderAIModelStats(stats)}
        </TabPane>
        <TabPane tab="Infrastructure" key="infrastructure">
          {renderInfrastructureStats(stats)}
        </TabPane>
      </Tabs>
    </div>
  );
};

const renderPerformanceStats = (stats: SystemStats) => {
  return (
    <div className={styles.performanceStats}>
      <Card title="Response Time">
        <h3>{formatNumber(stats.averageResponseTime)} ms</h3>
        <p>Average response time</p>
      </Card>
      <Card title="Throughput">
        <h3>{formatNumber(stats.requestsPerSecond)} req/s</h3>
        <p>Requests per second</p>
      </Card>
      <Card title="Error Rate">
        <h3>{formatPercentage(stats.errorRate)}</h3>
        <p>Error rate</p>
      </Card>
      <Chart
        type="line"
        data={stats.performanceTrend}
        title="Performance Trend"
        xAxis="timestamp"
        yAxis="value"
      />
    </div>
  );
};

const renderUsageStats = (stats: SystemStats) => {
  return (
    <div className={styles.usageStats}>
      <Card title="Active Users">
        <h3>{formatNumber(stats.activeUsers)}</h3>
        <p>Current active users</p>
      </Card>
      <Card title="Total Sessions">
        <h3>{formatNumber(stats.totalSessions)}</h3>
        <p>Total sessions today</p>
      </Card>
      <Card title="Average Session Duration">
        <h3>{formatNumber(stats.averageSessionDuration)} min</h3>
        <p>Average session duration</p>
      </Card>
      <Table
        data={stats.usageBreakdown}
        columns={[
          { title: 'Feature', dataIndex: 'feature', key: 'feature' },
          { title: 'Usage Count', dataIndex: 'count', key: 'count' },
          { title: 'Percentage', dataIndex: 'percentage', key: 'percentage', render: (value: number) => formatPercentage(value) },
        ]}
        title="Usage Breakdown"
      />
    </div>
  );
};

const renderAIModelStats = (stats: SystemStats) => {
  return (
    <div className={styles.aiModelStats}>
      <Card title="Model Accuracy">
        <h3>{formatPercentage(stats.modelAccuracy)}</h3>
        <p>Overall model accuracy</p>
      </Card>
      <Card title="Model Response Time">
        <h3>{formatNumber(stats.modelResponseTime)} ms</h3>
        <p>Average model response time</p>
      </Card>
      <Card title="Model Usage">
        <h3>{formatNumber(stats.modelRequests)}</h3>
        <p>Total model requests today</p>
      </Card>
      <Chart
        type="bar"
        data={stats.modelPerformance}
        title="AI Model Performance"
        xAxis="metric"
        yAxis="value"
      />
    </div>
  );
};

const renderInfrastructureStats = (stats: SystemStats) => {
  return (
    <div className={styles.infrastructureStats}>
      <Card title="CPU Usage">
        <h3>{formatPercentage(stats.cpuUsage)}</h3>
        <p>Current CPU usage</p>
      </Card>
      <Card title="Memory Usage">
        <h3>{formatPercentage(stats.memoryUsage)}</h3>
        <p>Current memory usage</p>
      </Card>
      <Card title="Storage Usage">
        <h3>{formatPercentage(stats.storageUsage)}</h3>
        <p>Current storage usage</p>
      </Card>
      <Table
        data={stats.infrastructureHealth}
        columns={[
          { title: 'Component', dataIndex: 'component', key: 'component' },
          { title: 'Status', dataIndex: 'status', key: 'status' },
          { title: 'Last Updated', dataIndex: 'lastUpdated', key: 'lastUpdated', render: (value: string) => formatDate(value) },
        ]}
        title="Infrastructure Health"
      />
    </div>
  );
};

export default SystemStatsComponent;

// Human tasks:
// TODO: Design and implement custom visualizations for complex metrics
// TODO: Add real-time updates for critical system metrics
// TODO: Implement export functionality for system stats data