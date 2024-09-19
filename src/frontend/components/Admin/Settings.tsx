import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSettings, updateSettings } from '@/store/settingsSlice';
import { SystemSettings } from '@/types';
import { Form, Input, Select, Switch } from '@/components/UI/Form';
import { Button } from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';
import { Tabs, TabPane } from '@/components/UI/Tabs';
import { validateSettings } from '@/utils/validators';
import styles from '@/styles/Settings.module.css';

const SettingsComponent: React.FC = () => {
  const dispatch = useDispatch();
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const currentSettings = useSelector((state: any) => state.settings.data);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (currentSettings) {
      setSettings(currentSettings);
    }
  }, [currentSettings]);

  const handleUpdateSettings = async (newSettings: SystemSettings) => {
    try {
      const validationErrors = validateSettings(newSettings);
      if (validationErrors.length > 0) {
        // Handle validation errors
        console.error('Validation errors:', validationErrors);
        return;
      }

      await dispatch(updateSettings(newSettings));
      // Show success message
      console.log('Settings updated successfully');
    } catch (error) {
      // Handle and display errors
      console.error('Error updating settings:', error);
    }
  };

  const renderGeneralSettings = (settings: SystemSettings) => (
    <Form onSubmit={(values) => handleUpdateSettings({ ...settings, ...values })}>
      <Input
        label="System Name"
        name="systemName"
        defaultValue={settings.systemName}
      />
      <Select
        label="Default Language"
        name="defaultLanguage"
        options={[
          { value: 'en', label: 'English' },
          { value: 'es', label: 'Spanish' },
          { value: 'fr', label: 'French' },
        ]}
        defaultValue={settings.defaultLanguage}
      />
      <Switch
        label="Enable Advanced Features"
        name="enableAdvancedFeatures"
        defaultChecked={settings.enableAdvancedFeatures}
      />
      <Input
        label="API Rate Limit"
        name="apiRateLimit"
        type="number"
        defaultValue={settings.apiRateLimit}
      />
      <Button type="submit">Update General Settings</Button>
    </Form>
  );

  const renderSecuritySettings = (settings: SystemSettings) => (
    <Form onSubmit={(values) => handleUpdateSettings({ ...settings, ...values })}>
      <Select
        label="Authentication Method"
        name="authMethod"
        options={[
          { value: 'local', label: 'Local Authentication' },
          { value: 'oauth', label: 'OAuth' },
          { value: 'ldap', label: 'LDAP' },
        ]}
        defaultValue={settings.authMethod}
      />
      <Input
        label="Password Policy"
        name="passwordPolicy"
        defaultValue={settings.passwordPolicy}
      />
      <Switch
        label="Enable Two-Factor Authentication"
        name="enableTwoFactor"
        defaultChecked={settings.enableTwoFactor}
      />
      <Input
        label="Session Timeout (minutes)"
        name="sessionTimeout"
        type="number"
        defaultValue={settings.sessionTimeout}
      />
      <Button type="submit">Update Security Settings</Button>
    </Form>
  );

  const renderIntegrationSettings = (settings: SystemSettings) => (
    <Form onSubmit={(values) => handleUpdateSettings({ ...settings, ...values })}>
      <Input
        label="CRM API Endpoint"
        name="crmApiEndpoint"
        defaultValue={settings.crmApiEndpoint}
      />
      <Input
        label="CRM API Key"
        name="crmApiKey"
        type="password"
        defaultValue={settings.crmApiKey}
      />
      <Switch
        label="Enable CRM Integration"
        name="enableCrmIntegration"
        defaultChecked={settings.enableCrmIntegration}
      />
      <Input
        label="ERP API Endpoint"
        name="erpApiEndpoint"
        defaultValue={settings.erpApiEndpoint}
      />
      <Input
        label="ERP API Key"
        name="erpApiKey"
        type="password"
        defaultValue={settings.erpApiKey}
      />
      <Switch
        label="Enable ERP Integration"
        name="enableErpIntegration"
        defaultChecked={settings.enableErpIntegration}
      />
      <Button type="submit">Update Integration Settings</Button>
    </Form>
  );

  const renderNotificationSettings = (settings: SystemSettings) => (
    <Form onSubmit={(values) => handleUpdateSettings({ ...settings, ...values })}>
      <Switch
        label="Enable Email Notifications"
        name="enableEmailNotifications"
        defaultChecked={settings.enableEmailNotifications}
      />
      <Switch
        label="Enable SMS Notifications"
        name="enableSmsNotifications"
        defaultChecked={settings.enableSmsNotifications}
      />
      <Input
        label="Email SMTP Server"
        name="emailSmtpServer"
        defaultValue={settings.emailSmtpServer}
      />
      <Input
        label="SMS API Endpoint"
        name="smsApiEndpoint"
        defaultValue={settings.smsApiEndpoint}
      />
      <Select
        label="Notification Frequency"
        name="notificationFrequency"
        options={[
          { value: 'realtime', label: 'Real-time' },
          { value: 'hourly', label: 'Hourly' },
          { value: 'daily', label: 'Daily' },
        ]}
        defaultValue={settings.notificationFrequency}
      />
      <Button type="submit">Update Notification Settings</Button>
    </Form>
  );

  if (!settings) {
    return <div>Loading settings...</div>;
  }

  return (
    <Card className={styles.settingsCard}>
      <h1 className={styles.settingsTitle}>System Settings</h1>
      <Tabs defaultActiveKey="general">
        <TabPane tab="General" key="general">
          {renderGeneralSettings(settings)}
        </TabPane>
        <TabPane tab="Security" key="security">
          {renderSecuritySettings(settings)}
        </TabPane>
        <TabPane tab="Integrations" key="integrations">
          {renderIntegrationSettings(settings)}
        </TabPane>
        <TabPane tab="Notifications" key="notifications">
          {renderNotificationSettings(settings)}
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default SettingsComponent;

// Human tasks:
// TODO: Implement advanced configuration options for each setting category
// TODO: Add real-time validation for interdependent settings
// TODO: Implement backup and restore functionality for settings