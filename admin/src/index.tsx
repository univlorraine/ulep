import * as Sentry from '@sentry/react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const element = document.getElementById('root');

if (!element) {
    throw new Error('Missing root element');
}

const { ...props } = element.dataset;

const sentryDsn = process.env.REACT_APP_SENTRY_DSN;
if (sentryDsn) {
    Sentry.init({ dsn: sentryDsn });
}

const root = createRoot(element);

root.render(
    <React.StrictMode>
        <App {...props} />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
