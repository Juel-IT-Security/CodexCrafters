// Main entry point for the React application
// This file demonstrates how modern React apps bootstrap themselves

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Create React root and render the main App component
// This is the React 18+ way of rendering apps (replaces ReactDOM.render)
createRoot(document.getElementById("root")!).render(<App />);
