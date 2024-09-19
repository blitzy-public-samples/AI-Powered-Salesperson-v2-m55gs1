// Import necessary dependencies
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { rootReducer } from '@/store/rootReducer';
import { customMiddleware } from '@/store/middleware';
import { logger } from '@/utils/logger';

// Configure the Redux store
const configureAppStore = (preloadedState = {}) => {
  // Create middleware array with thunk and customMiddleware
  const middleware = [thunk, customMiddleware];

  // Add logger middleware in development environment
  if (process.env.NODE_ENV === 'development') {
    middleware.push(logger);
  }

  // Configure store using configureStore from Redux Toolkit
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(middleware),
    preloadedState,
    devTools: process.env.NODE_ENV !== 'production',
  });

  return store;
};

// Create and export the configured Redux store instance
export const store = configureAppStore();

// Export type representing the root state of the store
export type RootState = ReturnType<typeof store.getState>;

// Export type for the store's dispatch function
export type AppDispatch = typeof store.dispatch;