// src/pages/EditProductPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { PRODUCT_STATUSES } from "../constants/productStatus";

const EditProductPage = () => {
  const { id } = useParams();
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
    imageUrl: null,
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load product once
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        const p = res.data;

        setForm({
          name: p.name || "",
          description: p.description || "",
          category: p.category || "CEREAL",
          status: p.status || "FRESH",
          harvestDate: p.harvestDate || "",
          storageTemperature: p.storageTemperature ?? 5,
          storageHumidity: p.storageHumidity ?? 60,
          imageUrl: p.imageUrl || null,
        });

        setPreviewUrl(p.imageUrl || null);
      } catch (err) {
        console.error(err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setError("");

    if (file) {
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
    } else {
      setPreviewUrl(form.imageUrl || null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setSaving(true);

      let imageUrl = form.imageUrl || null;

      // Upload new image if user picked one
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadRes = await api.post("/files/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageUrl = uploadRes.data.url;
      }

      await api.put(`/products/${id}`, {
        ...form,
        imageUrl,
      });

      navigate("/products/my");
    } catch (err) {
      console.error(err);
      setError("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-main">
        <p>Loading product...</p>
      </div>
    );
  }

  return (
    <div className="page-main">
      {/* top header */}
      <header className="page-header">
        <div>
          <h2>Edit product</h2>
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
          <button
            type="button"
            className="btn btn-ghost"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* 2-column layout */}
      <div className="product-form-layout">
        {/* LEFT: main form card */}
        <div className="product-form-main">
          <div className="form-card">
            <h3 className="form-title">Batch information</h3>
            <p className="form-description">
              Update the quality status and storage conditions of this batch.
            </p>

            <form onSubmit={handleSubmit} className="form-grid product-form">
              <div className="form-field">
                <label>Name*</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
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
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="CEREAL">Cereal</option>
                  <option value="FRUIT">Fruit</option>
                  <option value="VEGETABLE">Vegetable</option>
                </select>
              </div>

              <div className="form-field">
                <label>Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
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
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, shelfLifeAuto: e.target.value === "true" }))
                      }
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
                        name="shelfLifeDays"
                        value={form.shelfLifeDays ?? ""}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            shelfLifeDays: e.target.value ? Number(e.target.value) : null,
                          }))
                        }
                        min={0}
                      />
                    </div>
                  )}

              {/* Image upload */}
              <div className="form-field form-field--full">
                <label>Product image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              {error && <p className="form-error">{error}</p>}

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => navigate("/products/my")}
                >
                  Cancel
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

        {/* RIGHT: contextual panel + image preview */}
        <aside className="product-form-side">
          <div className="side-panel">
            <h4>Current batch overview</h4>
            <p className="side-panel-sub">
              Adjust the status when the quality of the stock changes.
            </p>

            {previewUrl && (
              <div style={{ marginBottom: 12 }}>
                <img
                  src={previewUrl}
                  alt="Product"
                  style={{
                    width: "100%",
                    maxWidth: 220,
                    height: 150,
                    borderRadius: 18,
                    objectFit: "cover",
                    boxShadow: "0 14px 30px rgba(15,23,42,0.35)",
                  }}
                />
              </div>
            )}

            <div className="side-badges">
              <span className="side-badge">
                Category: <strong>{form.category}</strong>
              </span>
              <span className="side-badge">
                Status:{" "}
                <strong>{form.status.replace("_", " ")}</strong>
              </span>
            </div>

            <ul className="side-tips">
              <li>Keep cereals in cool, dry storage to prevent mold.</li>
              <li>Fruits are more sensitive to temperature changes.</li>
              <li>Update the status when a batch becomes ripe or spoiled.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EditProductPage;
