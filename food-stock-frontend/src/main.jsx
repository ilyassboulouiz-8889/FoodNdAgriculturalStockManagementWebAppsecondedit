// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css"; 
import "./styles.css"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <div className="app-root">
          <main className="app-main">
            <div className="app-container">
              <App />
            </div>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
