import * as Sentry from '@sentry/react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { version } from '../package.json';
import App from './App';
import reportWebVitals from './reportWebVitals';

const element = document.getElementById('root');

if (!element) {
    throw new Error('Missing root element');
}

const { ...props } = element.dataset;

Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    debug: process.env.REACT_APP_ENV === 'dev',
    integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
    release: `ulep-admin@${version}`,
    dist: '1',
    environment: process.env.REACT_APP_ENV,
    tracesSampleRate: 1.0,
});

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
