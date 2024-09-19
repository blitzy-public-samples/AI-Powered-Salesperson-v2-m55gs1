import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { MainLayout } from '@/components/Layout/MainLayout';
import { HomePage } from '@/pages/Home';
import { ChatPage } from '@/pages/Chat';
import { QuotePage } from '@/pages/Quote';
import { AdminPage } from '@/pages/Admin';
import { LoginPage } from '@/pages/Login';
import { RegisterPage } from '@/pages/Register';
import { PrivateRoute } from '@/components/Auth/PrivateRoute';
import { isAuthenticated } from '@/utils/auth';
import '@/styles/global.css';

const App: React.FC = () => {
  return (
    // Wrap the entire application with Redux Provider
    <Provider store={store}>
      {/* Set up BrowserRouter for routing */}
      <Router>
        {/* Render MainLayout component */}
        <MainLayout>
          {/* Set up Switch for route matching */}
          <Switch>
            {/* Define routes for HomePage, ChatPage, QuotePage, AdminPage, LoginPage, and RegisterPage */}
            <Route exact path="/" component={HomePage} />
            <PrivateRoute path="/chat" component={ChatPage} isAuthenticated={isAuthenticated} />
            <PrivateRoute path="/quote" component={QuotePage} isAuthenticated={isAuthenticated} />
            <PrivateRoute path="/admin" component={AdminPage} isAuthenticated={isAuthenticated} />
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
          </Switch>
        </MainLayout>
      </Router>
    </Provider>
  );
};

export default App;

// Human tasks:
// TODO: Implement error boundary for catching and displaying runtime errors
// TODO: Add global state management for user authentication status
// TODO: Implement lazy loading for route components to improve initial load time