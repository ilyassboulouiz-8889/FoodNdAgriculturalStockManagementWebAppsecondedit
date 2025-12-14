// src/components/AddProductForm.jsx
import React, { useState } from "react";
import api from "../api/axios";
import { PRODUCT_STATUSES } from "../constants/productStatus";

const AddProductForm = ({ onProductAdded }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("CEREAL");
  const [status, setStatus] = useState("FRESH");
  const [harvestDate, setHarvestDate] = useState(""); // datetime-local
  const [storageTemperature, setStorageTemperature] = useState(5);
  const [storageHumidity, setStorageHumidity] = useState(60);

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategory("CEREAL");
    setStatus("FRESH");
    setHarvestDate("");
    setStorageTemperature(5);
    setStorageHumidity(60);
    setImageFile(null);
    setPreviewUrl(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setSuccess("");
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setSaving(true);

      let imageUrl = null;

      // 1) upload image if provided
      if (imageFile) {
  const formData = new FormData();
  formData.append("file", imageFile);

  const uploadRes = await api.post("/files/upload", formData);
  imageUrl = uploadRes.data.url;
}


      // 2) create product
      await api.post("/products", {
        name,
        description,
        category,
        status,
        harvestDate: harvestDate || null,
        storageTemperature,
        storageHumidity,
        imageUrl, // may be null
      });

      resetForm();
      setSuccess("Product created successfully.");

      if (onProductAdded) onProductAdded();
    } catch (err) {
      console.error(err);
      setError("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-grid product-form">
      {/* Name */}
      <div className="form-field">
        <label>Name*</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Category & Status */}
      <div className="form-field">
        <label>Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="CEREAL">Cereal</option>
          <option value="FRUIT">Fruit</option>
          <option value="VEGETABLE">Vegetable</option>
        </select>
      </div>

      <div className="form-field">
        <label>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {PRODUCT_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="form-field form-field--full">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      {/* Harvest date */}
      <div className="form-field">
        <label>Harvest date</label>
        <input
          type="datetime-local"
          value={harvestDate}
          onChange={(e) => setHarvestDate(e.target.value)}
        />
      </div>

      {/* Storage conditions */}
      <div className="form-field">
        <label>Storage temperature (°C)</label>
        <input
          type="number"
          value={storageTemperature}
          onChange={(e) => setStorageTemperature(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label>Storage humidity (%)</label>
        <input
          type="number"
          value={storageHumidity}
          onChange={(e) => setStorageHumidity(e.target.value)}
        />
      </div>

      {/* Image upload */}
      <div className="form-field form-field--full">
        <label>Product image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {previewUrl && (
          <div style={{ marginTop: 8 }}>
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                width: 160,
                height: 120,
                borderRadius: 14,
                objectFit: "cover",
                boxShadow: "0 8px 20px rgba(15,23,42,0.35)",
              }}
            />
          </div>
        )}
      </div>

      {/* Messages */}
      {error && (
        <p className="form-error" style={{ width: "100%" }}>
          {error}
        </p>
      )}
      {success && (
        <p
          style={{
            color: "#166534",
            width: "100%",
            fontSize: 13,
            marginTop: 4,
          }}
        >
          {success}
        </p>
      )}

      {/* Actions */}
      <div className="form-actions" style={{ width: "100%" }}>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={resetForm}
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary"
        >
          {saving ? "Saving..." : "Save product"}
        </button>
      </div>
    </form>
  );
};

export default AddProductForm;
