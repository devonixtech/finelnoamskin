import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { ErrorBoundary } from "./components/ErrorBoundary";

console.log("[main.tsx] Application bootstrapping started...");

// Global error handler for catching silent crashes
window.onerror = (message, source, lineno, colno, error) => {
  const errorMsg = `Global Error: ${message} at ${source}:${lineno}:${colno}`;
  console.error(errorMsg, error);
  const root = document.getElementById("root");
  if (root && root.innerHTML === "") {
    root.innerHTML = `<div style="padding: 20px; color: red; font-family: sans-serif;">
      <h1>Application Crash Detected</h1>
      <p>${errorMsg}</p>
      <pre>${error?.stack || 'No stack trace available'}</pre>
    </div>`;
  }
};

window.onunhandledrejection = (event) => {
  console.error("Unhandled Promise Rejection:", event.reason);
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

// Kill all service workers on every pageload — they break Vite lazy chunks
if (navigator.serviceWorker) {
  navigator.serviceWorker.getRegistrations().then(function(regs) {
    regs.forEach(function(r) { r.unregister(); });
    if (regs.length) console.log('SW unregistered:', regs.length);
  });
}
