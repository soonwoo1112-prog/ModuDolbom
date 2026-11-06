import React from 'react';
import { createRoot } from 'react-dom/client';
import '../../design/tokens.css';
import '../../design/system/components/bundle.css';
import './app.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(<App />);
