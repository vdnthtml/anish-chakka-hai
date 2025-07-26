// src/main.tsx
// Main entry point for the React application. Mounts the App component to the DOM and sets up the root rendering logic.

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
