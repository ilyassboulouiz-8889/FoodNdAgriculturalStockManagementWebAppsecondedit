// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import appLogo from "../assets/FarmersChoice.png";

const RegisterPage = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, updateUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullname || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // 1) Register (no avatar upload yet)
      const res = await api.post("/auth/register", { fullname, email, password });

      // Expecting backend: { token, user } OR token + flat fields
      const token = res.data.token;
      const user = res.data.user ?? res.data;

      if (!token) throw new Error("Register response missing token.");

      // 2) Store token + user immediately
      login(token, user);

      // 3) If avatar selected -> upload (authenticated)
      if (avatarFile) {
        const fd = new FormData();
        fd.append("file", avatarFile);

        const uploadRes = await api.post("/files/upload", fd, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const avatarUrl = uploadRes.data.url;

        // 4) Save avatarUrl in profile
        await api.put(
          "/users/me",
          { fullname: user.fullname ?? fullname, avatarUrl },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // 5) Update context/localStorage
        updateUser({ avatarUrl });
      }

      navigate("/products/my");
    } catch (err) {
      console.error("REGISTER ERROR >>>", err?.response || err);

      const msg =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err.message ||
        "Registration failed.";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* ✅ background logo OUTSIDE card */}
      <img src={appLogo} alt="" className="auth-bg-logo" />

      <div className="card auth-card">
        <h2 style={{ marginTop: 0, marginBottom: 6 }}>Create an account</h2>
        <p className="text-muted" style={{ marginTop: 0, marginBottom: 18 }}>
          Join the platform and start managing your agricultural stock.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="fullname">
              Full name
            </label>
            <input
              id="fullname"
              className="input"
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="John Farmer"
            />
          </div>

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
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              className="input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••"
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="avatar">
              Avatar (optional)
            </label>
            <input
              id="avatar"
              className="input"
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
            />
            <p className="text-muted" style={{ marginTop: 6, fontSize: 12 }}>
              Avatar will be uploaded after your account is created.
            </p>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: 6 }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p
          className="text-muted"
          style={{ marginTop: 16, textAlign: "center", fontSize: "0.85rem" }}
        >
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{
              border: "none",
              background: "none",
              color: "var(--color-primary)",
              cursor: "pointer",
              padding: 0,
              font: "inherit",
            }}
          >
            Go to login
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
