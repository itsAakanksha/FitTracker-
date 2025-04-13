// src/main.jsx (Entry Point)

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; // Import Provider
import { store } from './app/store';    // Import store
import App from './App';
import './index.css'; // Ensure Tailwind directives are here

// Get the root element from the HTML
const rootElement = document.getElementById('root');

// Ensure the root element exists before rendering
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      {/* Wrap the entire App with the Redux Provider to make the store available */}
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
  );
} else {
  console.error("Failed to find the root element with ID 'root'.");
}