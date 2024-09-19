import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { App } from '@/App';
import { setupErrorHandling } from '@/utils/errorHandler';
import { initializeAnalytics } from '@/utils/analytics';
import '@/styles/index.css';

// Function to render the main App component with necessary providers
const renderApp = () => {
  // Create root element if it doesn't exist
  const rootElement = document.getElementById('root') || document.createElement('div');
  rootElement.id = 'root';
  document.body.appendChild(rootElement);

  // Use ReactDOM.createRoot for concurrent mode if available, otherwise fall back to ReactDOM.render
  if (ReactDOM.createRoot) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>
    );
  } else {
    ReactDOM.render(
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>,
      rootElement
    );
  }
};

// Function to initialize the application
const initializeApp = () => {
  // Set up global error handling
  setupErrorHandling();

  // Initialize analytics
  initializeAnalytics();

  // Render the application
  renderApp();
};

// Initialize the application
initializeApp();

// Human tasks (to be implemented):
// TODO: Implement environment-specific configurations (development, production, etc.)
// TODO: Set up service worker for offline capabilities and PWA support
// TODO: Implement feature flags or A/B testing setup if required