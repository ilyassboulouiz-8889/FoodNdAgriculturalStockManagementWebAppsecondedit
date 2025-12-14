// src/pages/AddProductPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { PRODUCT_STATUSES } from "../constants/productStatus";

const AddProductPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "CEREAL",
    status: "FRESH",
    harvestDate: "",

    storageTemperature: 5,
    storageHumidity: 60,

    // ✅ IMPORTANT: default to AUTO so the select works
    shelfLifeAuto: true,
    shelfLifeDays: null,
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ✅ avoid memory leak from URL.createObjectURL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // number inputs come as string => convert
    if (type === "number") {
      setForm((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleShelfModeChange = (e) => {
    const isAuto = e.target.value === "true";
    setForm((prev) => ({
      ...prev,
      shelfLifeAuto: isAuto,
      // if switching to auto, clear manual days
      shelfLifeDays: isAuto ? null : prev.shelfLifeDays,
    }));
  };

  const handleManualDaysChange = (e) => {
    const v = e.target.value;
    setForm((prev) => ({
      ...prev,
      shelfLifeDays: v === "" ? null : Number(v),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // simple validation
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (form.shelfLifeAuto === false && (form.shelfLifeDays == null || form.shelfLifeDays < 0)) {
      setError("Shelf life days must be 0 or more.");
      return;
    }

    try {
      setSaving(true);

      // ✅ 1) upload image first
      let imageUrl = null;
      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);

        const uploadRes = await api.post("/files/upload", fd);
        imageUrl = uploadRes.data.url;
      }

      // ✅ 2) build payload as JSON only
      const payload = {
        name: form.name,
        description: form.description,
        category: form.category,
        status: form.status,

        // IMPORTANT: empty string breaks LocalDateTime in backend
        harvestDate: form.harvestDate?.trim() ? form.harvestDate.trim() : null,

        storageTemperature: Number(form.storageTemperature),
        storageHumidity: Number(form.storageHumidity),

        shelfLifeAuto: Boolean(form.shelfLifeAuto),
        shelfLifeDays: form.shelfLifeAuto ? null : form.shelfLifeDays,

        imageUrl,
      };

      await api.post("/products/add", payload);

      navigate("/products/my");
    } catch (err) {
      console.error("ADD PRODUCT ERROR >>>", err?.response || err);
      const msg =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        "Failed to create product";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-main">
      {/* top header */}
      <header className="page-header">
        <div>
          <h2>Add new product</h2>
          {user && (
            <p className="page-subtitle">
              Logged in as <strong>{user.fullname}</strong> ({user.email})
            </p>
          )}
        </div>

        <div className="page-header-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => navigate("/products/my")}
          >
            My products
          </button>

          {user?.role === "ADMIN" && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate("/admin/products")}
            >
              Admin
            </button>
          )}

          <button type="button" className="btn btn-ghost" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* 2-column layout */}
      <div className="product-form-layout">
        {/* LEFT: form */}
        <div className="product-form-main">
          <div className="form-card">
            <h3 className="form-title">New batch details</h3>
            <p className="form-description">
              Register a fresh batch of cereals, fruits or vegetables in your stock.
            </p>

            <form onSubmit={handleSubmit} className="form-grid product-form">
              <div className="form-field">
                <label>Name*</label>
                <input name="name" value={form.name} onChange={handleChange} required />
              </div>

              <div className="form-field form-field--full">
                <label>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="form-field">
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="CEREAL">Cereal</option>
                  <option value="FRUIT">Fruit</option>
                  <option value="VEGETABLE">Vegetable</option>
                </select>
              </div>

              <div className="form-field">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  {PRODUCT_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>Harvest date (ISO)</label>
                <input
                  name="harvestDate"
                  value={form.harvestDate}
                  onChange={handleChange}
                  placeholder="2025-12-01T00:00:00"
                />
              </div>

              <div className="form-field">
                <label>Storage temperature (°C)</label>
                <input
                  type="number"
                  name="storageTemperature"
                  value={form.storageTemperature}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>Storage humidity (%)</label>
                <input
                  type="number"
                  name="storageHumidity"
                  value={form.storageHumidity}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>Shelf life mode</label>
                <select
                  name="shelfLifeAuto"
                  value={String(form.shelfLifeAuto)}
                  onChange={handleShelfModeChange}
                >
                  <option value="true">Auto (recommended)</option>
                  <option value="false">Manual</option>
                </select>
              </div>

              {form.shelfLifeAuto === false && (
                <div className="form-field">
                  <label>Shelf life (days)</label>
                  <input
                    type="number"
                    value={form.shelfLifeDays ?? ""}
                    onChange={handleManualDaysChange}
                    min={0}
                  />
                </div>
              )}

              <div className="form-field form-field--full">
                <label>Product image (optional)</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </div>

              {previewUrl && (
                <div className="form-field form-field--full" style={{ marginTop: -6 }}>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      width: 120,
                      height: 90,
                      objectFit: "cover",
                      borderRadius: 12,
                      border: "1px solid rgba(6, 78, 59, 0.12)",
                      boxShadow: "0 12px 26px rgba(6, 78, 59, 0.12)",
                    }}
                  />
                </div>
              )}

              {error && <p className="form-error">{error}</p>}

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => navigate("/products/my")}
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? "Saving..." : "Save product"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT: tips */}
        <aside className="product-form-side">
          <div className="side-panel">
            <h4>Storage tips</h4>
            <p className="side-panel-sub">Good storage conditions keep your stock fresh and safe.</p>

            <ul className="side-tips">
              <li>Fill in accurate harvest dates for traceability.</li>
              <li>Use realistic temperatures and humidity for each category.</li>
              <li>
                Start all new batches as <strong>Fresh</strong> or <strong>Dry</strong>{" "}
                depending on the product.
              </li>
            </ul>

            <div className="side-footer">
              🌾🍏🥕 <span>Quality starts with good data.</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AddProductPage;
