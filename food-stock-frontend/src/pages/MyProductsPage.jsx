// src/pages/MyProductsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { PRODUCT_STATUSES, STATUS_COLORS } from "../constants/productStatus";
import TopNav from "../components/TopNav";
import { toApiUrl } from "../utils/url";

// 👉 default images (fallback when no uploaded image)
import cerealFresh from "../assets/cereal-fresh.png";
import cerealRipe from "../assets/cereal-fresh.png";
import cerealDry from "../assets/cereal-fresh.png";

import fruitFresh from "../assets/fruit-fresh.png";
import fruitRipe from "../assets/fruit-ripe.png";
import fruitSpoiled from "../assets/fruit-spoiled.png";

import vegFresh from "../assets/vegetable-fresh.jpg";
import vegLowQuality from "../assets/vegetable-low-quality.png";
import vegSpoiled from "../assets/vegetable-spoiled.png";

const getRemainingDays = (expiresAt) => {
  if (!expiresAt) return null;
  const ms = new Date(expiresAt).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
};

// mapping category + status -> default image
const PRODUCT_IMAGES = {
  CEREAL: {
    FRESH: cerealFresh,
    RIPE: cerealRipe,
    DRY: cerealDry,
    LOW_QUALITY: cerealDry,
    SPOILED: cerealDry,
  },
  FRUIT: {
    FRESH: fruitFresh,
    RIPE: fruitRipe,
    DRY: fruitRipe,
    LOW_QUALITY: fruitSpoiled,
    SPOILED: fruitSpoiled,
  },
  VEGETABLE: {
    FRESH: vegFresh,
    RIPE: vegFresh,
    DRY: vegLowQuality,
    LOW_QUALITY: vegLowQuality,
    SPOILED: vegSpoiled,
  },
};

function getDefaultProductImage(category, status) {
  const catMap = PRODUCT_IMAGES[category];
  if (catMap) return catMap[status] || catMap.FRESH;
  return fruitFresh;
}

// ✅ pick uploaded image if exists, otherwise fallback to default-by-status
function getProductCardImageSrc(p) {
  if (p?.imageUrl) return toApiUrl(p.imageUrl);
  return getDefaultProductImage(p?.category, p?.status);
}

const MyProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  // filters
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");

  // ✅ nice confirm modal state
  const [confirmDelete, setConfirmDelete] = useState(null); // product object or null
  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = async (params = {}) => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/products/my", { params });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (name) params.name = name;
    if (status) params.status = status;
    if (category) params.category = category;
    fetchProducts(params);
  };

  const handleChangeStatus = async (productId, newStatus) => {
    try {
      await api.put(`/products/${productId}/status`, null, {
        params: { newStatus },
      });

      fetchProducts({
        name: name || undefined,
        status: status || undefined,
        category: category || undefined,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to change status");
    }
  };

  // ✅ open confirm modal
  const requestDelete = (product) => {
    setConfirmDelete(product);
  };

  // ✅ confirm delete (soft delete)
  const confirmDeleteProduct = async () => {
    if (!confirmDelete) return;

    try {
      setDeletingId(confirmDelete.id);

      await api.delete(`/products/${confirmDelete.id}`);

      await fetchProducts({
        name: name || undefined,
        status: status || undefined,
        category: category || undefined,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  return (
    <>
      <TopNav />

      <div className="page-main">
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <div>
            <h2>My Products</h2>
            {user && (
              <p style={{ margin: 0 }}>
                Logged in as <strong>{user.fullname}</strong> ({user.email})
              </p>
            )}
          </div>
        </header>

        {/* Filters */}
        <form
          onSubmit={handleFilterSubmit}
          className="filter-bar"
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <input
            placeholder="Name contains..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Any status</option>
            {PRODUCT_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Any category</option>
            <option value="CEREAL">CEREAL</option>
            <option value="FRUIT">FRUIT</option>
            <option value="VEGETABLE">VEGETABLE</option>
          </select>

          <button type="submit">Filter</button>
        </form>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && products.length === 0 && <p>No products found.</p>}

        <div style={{ display: "grid", gap: "12px" }}>
          {products.map((p) => {
            const imgSrc = getProductCardImageSrc(p);
            const fallbackSrc = getDefaultProductImage(p.category, p.status);

            return (
              <div key={p.id} className="product-card">
                {/* LEFT */}
                <div style={{ flexGrow: 1 }}>
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>

                  <p>
                    <strong>Category:</strong> {p.category} &nbsp; | &nbsp;
                    <strong>Status:</strong>{" "}
                    <span
                      style={{
                        color: STATUS_COLORS[p.status] || "gray",
                        fontWeight: "bold",
                      }}
                    >
                      {String(p.status).replace("_", " ")}
                    </span>
                  </p>

                  <p>
                    <strong>Harvest:</strong> {p.harvestDate}
                  </p>
                  <p>
                    <strong>Temp:</strong> {p.storageTemperature} °C &nbsp; | &nbsp;
                    <strong>Humidity:</strong> {p.storageHumidity} %
                  </p>

                  <p>
                    <strong>Shelf life:</strong>{" "}
                    {p.shelfLifeDays != null ? `${p.shelfLifeDays} days` : "—"}
                    {"  "} | {"  "}
                    <strong>Expires at:</strong>{" "}
                    {p.expiresAt ? p.expiresAt : "—"}
                  </p>

                  {p.expiresAt && (
                    <p>
                      <strong>Remaining:</strong> {getRemainingDays(p.expiresAt)} day(s)
                    </p>
                  )}

                  <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <label>
                      Change status:{" "}
                      <select
                        value={p.status}
                        onChange={(e) => handleChangeStatus(p.id, e.target.value)}
                      >
                        {PRODUCT_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        navigate(`/products/${p.id}/history`, {
                          state: {
                            imageUrl: p.imageUrl,
                            name: p.name,
                            category: p.category,
                          },
                        })
                      }
                    >
                      History
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate(`/products/${p.id}/edit`)}
                      className="btn btn-ghost"
                      style={{ fontSize: 12 }}
                    >
                      Modify
                    </button>

                    {/* ✅ modal instead of window.confirm */}
                    <button
                      type="button"
                      onClick={() => requestDelete(p)}
                      className="btn btn-danger"
                      style={{ fontSize: 12 }}
                    >
                       delete
                    </button>
                  </div>

                  {p.history && p.history.length > 0 && (
                    <details style={{ marginTop: 8 }}>
                      <summary>Status history ({p.history.length})</summary>
                      <ul>
                        {p.history.map((h) => (
                          <li key={h.id}>
                            <strong>{h.newStatus}</strong> at {h.changedAt}
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>

                {/* RIGHT: uploaded image if exists, else default by status */}
                <div
                  style={{
                    width: 140,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={imgSrc}
                    alt={p.name}
                    style={{
                      width: "140px",
                      height: "140px",
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                    onError={(e) => {
                      if (e.currentTarget.src !== fallbackSrc) {
                        e.currentTarget.src = fallbackSrc;
                      }
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ✅ Confirm modal */}
      {confirmDelete && (
        <div className="confirm-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete product</h3>

            <p>
              You are about to delete <strong>{confirmDelete.name}</strong>.
            </p>

            

            <div className="confirm-actions">
              <button
                className="btn btn-ghost"
                onClick={() => setConfirmDelete(null)}
                disabled={!!deletingId}
              >
                Cancel
              </button>

              <button
                className="btn btn-danger"
                onClick={confirmDeleteProduct}
                disabled={!!deletingId}
              >
                {deletingId ? "Deleting..." : "Confirm delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyProductsPage;
