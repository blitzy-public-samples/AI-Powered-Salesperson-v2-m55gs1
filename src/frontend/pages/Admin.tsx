import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Switch, useLocation, useNavigate } from 'react-router-dom';
import { fetchAdminDashboardData } from '@/store/adminSlice';
import { selectUser } from '@/store/userSlice';
import AdminLayout from '@/components/Layout/AdminLayout';
import Dashboard from '@/components/Admin/Dashboard';
import UserManagement from '@/components/Admin/UserManagement';
import SystemStats from '@/components/Admin/SystemStats';
import AIModelConfig from '@/components/Admin/AIModelConfig';
import Settings from '@/components/Admin/Settings';
import Sidebar from '@/components/UI/Sidebar';
import Breadcrumb from '@/components/UI/Breadcrumb';
import { requireAdminAuth } from '@/utils/auth';
import { trackAdminPageView } from '@/utils/analytics';
import styles from '@/styles/Admin.module.css';

const AdminPage: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [currentSection, setCurrentSection] = useState<string>('dashboard');

  // Check admin authentication
  useEffect(() => {
    requireAdminAuth();
  }, []);

  // Fetch admin dashboard data on component mount
  useEffect(() => {
    dispatch(fetchAdminDashboardData());
  }, [dispatch]);

  // Track admin page views for analytics
  useEffect(() => {
    trackAdminPageView(location.pathname);
  }, [location]);

  const handleSectionChange = (newSection: string) => {
    setCurrentSection(newSection);
    navigate(`/admin/${newSection}`);
    trackAdminPageView(`/admin/${newSection}`);
  };

  const renderAdminContent = (section: string): JSX.Element => {
    switch (section) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserManagement />;
      case 'stats':
        return <SystemStats />;
      case 'ai-config':
        return <AIModelConfig />;
      case 'settings':
        return <Settings />;
      default:
        return <div>Unknown section</div>;
    }
  };

  return (
    <AdminLayout>
      <div className={styles.adminContainer}>
        <Sidebar
          items={[
            { label: 'Dashboard', value: 'dashboard' },
            { label: 'User Management', value: 'users' },
            { label: 'System Stats', value: 'stats' },
            { label: 'AI Model Config', value: 'ai-config' },
            { label: 'Settings', value: 'settings' },
          ]}
          activeItem={currentSection}
          onItemClick={handleSectionChange}
        />
        <div className={styles.adminContent}>
          <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: currentSection }]} />
          <Switch>
            <Route path="/admin/dashboard" component={() => renderAdminContent('dashboard')} />
            <Route path="/admin/users" component={() => renderAdminContent('users')} />
            <Route path="/admin/stats" component={() => renderAdminContent('stats')} />
            <Route path="/admin/ai-config" component={() => renderAdminContent('ai-config')} />
            <Route path="/admin/settings" component={() => renderAdminContent('settings')} />
            <Route path="/admin" exact component={() => renderAdminContent('dashboard')} />
          </Switch>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPage;

// Human tasks:
// TODO: Implement role-based access control for different admin sections
// TODO: Add real-time notifications for critical system events
// TODO: Implement advanced search and filtering for admin data views