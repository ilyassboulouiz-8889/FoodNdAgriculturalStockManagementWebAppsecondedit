// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toApiUrl } from "../utils/url";

// helper: turn relative path into full backend URL, but keep blob: URLs
function resolveAvatarSrc(value) {
  if (!value) return null;

  // local preview when user has just selected a file
  if (value.startsWith("blob:")) return value;

  // value from backend: "/uploads/xxx.jpg" or "uploads/xxx.jpg"
  return toApiUrl(value);
}

const ProfilePage = () => {
  const { user, token, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [fullname, setFullname] = useState(user?.fullname || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || null);

  const [loading, setLoading] = useState(!user);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // load profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/users/me");
        const data = res.data;

        setFullname(data.fullname || "");
        setEmail(data.email || "");
        setRole(data.role || "");
        setAvatarUrl(data.avatarUrl || "");
        setAvatarPreview(data.avatarUrl || null);

        // sync AuthContext if possible
        if (user && typeof updateUser === "function") {
          updateUser({
            ...user,
            fullname: data.fullname,
            email: data.email,
            role: data.role,
            avatarUrl: data.avatarUrl || "",
          });
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0] || null;
    setAvatarFile(file);
    setSuccess("");
    setError("");

    if (file) {
      const localUrl = URL.createObjectURL(file);
      setAvatarPreview(localUrl); // blob:...
    } else {
      setAvatarPreview(avatarUrl || null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setSaving(true);

      let newAvatarUrl = avatarUrl || null;

      // 1) upload avatar file if we selected a new one
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);

        const uploadRes = await api.post("/files/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        newAvatarUrl = uploadRes.data.url; // e.g. "/uploads/xxxx.jpg"
      }

      // 2) update profile
      const res = await api.put("/users/me", {
        fullname,
        avatarUrl: newAvatarUrl,
      });

      const updated = res.data;

      // 3) update context + local state
      if (typeof updateUser === "function") {
        updateUser({
          ...(user || {}),
          fullname: updated.fullname,
          email: updated.email,
          role: updated.role,
          avatarUrl: updated.avatarUrl || newAvatarUrl || "",
          userId: updated.id ?? user?.userId,
        });
      }

      setAvatarUrl(updated.avatarUrl || newAvatarUrl || "");
      setAvatarPreview(updated.avatarUrl || newAvatarUrl || "");
      setSuccess("Profile updated successfully.");
      setAvatarFile(null);
    } catch (err) {
      console.error(err);
      // show more explicit message if Spring says "Maximum upload size exceeded"
      if (
        err?.response?.data?.message &&
        String(err.response.data.message).includes("Maximum upload size")
      ) {
        setError("Avatar too large (Maximum upload size exceeded).");
      } else {
        setError("Failed to update profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (user) {
      setFullname(user.fullname || "");
      setEmail(user.email || "");
      setRole(user.role || "");
      setAvatarUrl(user.avatarUrl || "");
      setAvatarPreview(user.avatarUrl || null);
      setAvatarFile(null);
      setError("");
      setSuccess("");
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl("");
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  if (!token) {
    return (
      <div className="page-main">
        <p>Please log in.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-main">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="page-main">
      {/* header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <div>
          <h2>My profile</h2>
          <p style={{ margin: 0, fontSize: 13, color: "#4b5563" }}>
            Manage your personal information and avatar.
          </p>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => navigate("/products/my")}
          >
            My products
          </button>
          {role === "ADMIN" && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate("/admin/products")}
            >
              Admin
            </button>
          )}
          <button
            type="button"
            className="btn btn-ghost"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* card */}
      <div className="form-card">
        <h3 style={{ marginTop: 0, marginBottom: 6 }}>Account details</h3>
        <p
          style={{
            marginTop: 0,
            marginBottom: 16,
            fontSize: 13,
            color: "#6b7280",
          }}
        >
          These details are linked to your Food Stock account.
        </p>

        <form onSubmit={handleSubmit} className="form-grid">
          {/* Avatar section */}
          <div
            className="form-field form-field--full"
            style={{ display: "flex", gap: 16, alignItems: "center" }}
          >
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: "999px",
                background:
                  "radial-gradient(circle at 30% 20%, #facc15, #f97316)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                boxShadow: "0 10px 25px rgba(15,23,42,0.45)",
              }}
            >
              {avatarPreview ? (
                <img
                  src={resolveAvatarSrc(avatarPreview)}
                  alt="Avatar preview"
                  className="user-avatar-img"
                />
              ) : (
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 22,
                    color: "#1f2937",
                  }}
                >
                  {fullname ? fullname.charAt(0).toUpperCase() : "U"}
                </span>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, fontWeight: 600 }}>
                Profile picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ marginTop: 4 }}
              />
              <p style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
                JPG or PNG, recommended at least 200×200 pixels.
              </p>
              {avatarPreview && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="btn btn-ghost"
                  style={{ fontSize: 11, padding: "2px 10px", marginTop: 4 }}
                >
                  Remove avatar
                </button>
              )}
            </div>
          </div>

          {/* Full name */}
          <div className="form-field form-field--full">
            <label>Full name</label>
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
          </div>

          {/* Email + role */}
          <div className="form-field">
            <label>Email (login)</label>
            <input type="email" value={email} disabled />
          </div>

          <div className="form-field">
            <label>Role</label>
            <input value={role || "USER"} disabled />
          </div>

          {error && (
            <p style={{ color: "red", width: "100%", marginTop: 4 }}>
              {error}
            </p>
          )}
          {success && (
            <p
              style={{
                color: "#166534",
                width: "100%",
                marginTop: 4,
                fontSize: 13,
              }}
            >
              {success}
            </p>
          )}

          <div
            style={{
              marginTop: 10,
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleReset}
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
