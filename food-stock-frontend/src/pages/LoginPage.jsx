// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import appLogo from "../assets/FarmersChoice.png";

const LoginPage = () => {
  const [email, setEmail] = useState("john@example.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, ...userData } = res.data;

      login(token, userData);
      navigate("/products/my");
    } catch (err) {
      console.log("LOGIN ERROR >>>", err?.response || err);

      if (err.response) {
        if (err.response.status === 401) setError("Invalid email or password.");
        else setError(`Server error (${err.response.status}). Check backend logs.`);
      } else {
        setError("Cannot reach server. Is Spring Boot running on :8080?");
      }
    }
  };

  return (
    <div className="auth-wrapper">
      {/* ✅ background logo OUTSIDE card */}
      <img src={appLogo} alt="" className="auth-bg-logo" />

      <div className="card auth-card">
        <h2 style={{ marginTop: 0, marginBottom: 6 }}>Welcome back</h2>
        <p className="text-muted" style={{ marginTop: 0, marginBottom: 18 }}>
          Sign in to manage your agricultural stock.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: 6 }}
          >
            Login
          </button>
        </form>

        <p
          className="text-muted"
          style={{ marginTop: 16, textAlign: "center", fontSize: "0.85rem" }}
        >
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            style={{
              border: "none",
              background: "none",
              color: "var(--color-primary)",
              cursor: "pointer",
              padding: 0,
              font: "inherit",
            }}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
