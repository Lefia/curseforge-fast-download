import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '@popup/App.jsx';
import '@popup/styles.scss';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
