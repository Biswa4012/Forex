import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // This imports the code from the Canvas

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
