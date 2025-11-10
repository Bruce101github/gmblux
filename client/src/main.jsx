import { BrowserRouter } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://e98424cf4a20f8f0205fbf92abca2a88@o4510340870766593.ingest.de.sentry.io/4510340887019600",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0, // performance monitoring (0–1)
  replaysSessionSampleRate: 0.1, // record 10% of all sessions
  replaysOnErrorSampleRate: 1.0, // record all sessions with errors
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Sentry.ErrorBoundary fallback={<p>Something went wrong.</p>}>
        <App />
      </Sentry.ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
);
