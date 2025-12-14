// src/pages/AdminProductsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { PRODUCT_STATUSES, STATUS_COLORS } from "../constants/productStatus";
import TopNav from "../components/TopNav";

const pickOwnerName = (p) => {
  // supports many possible backend shapes
  return (
    p?.ownerFullname ||
    p?.ownerName ||
    p?.owner?.fullname ||
    p?.owner?.name ||
    p?.owner?.fullName ||
    null
  );
};

const pickOwnerEmail = (p) => {
  return p?.ownerEmail || p?.owner?.email || null;
};

const AdminProductsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // filters
  const [ownerEmail, setOwnerEmail] = useState("");
  const [status, setStatus] = useState("");
  const [deletedFilter, setDeletedFilter] = useState("ONLY_ACTIVE"); // ALL | ONLY_ACTIVE | ONLY_DELETED

  // restore confirmation modal
  const [restoreTarget, setRestoreTarget] = useState(null); // product object or null
  const [restoring, setRestoring] = useState(false);

  const params = useMemo(() => {
    const p = {};
    if (ownerEmail.trim()) p.ownerEmail = ownerEmail.trim();
    if (status) p.status = status;
    if (deletedFilter) p.deletedFilter = deletedFilter;
    return p;
  }, [ownerEmail, status, deletedFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/admin/products", { params });
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load admin products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRestoreConfirmed = async () => {
    if (!restoreTarget?.id) return;

    try {
      setRestoring(true);
      await api.put(`/admin/products/${restoreTarget.id}/restore`);
      setRestoreTarget(null);
      await fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to restore product");
    } finally {
      setRestoring(false);
    }
  };

  const handleChangeStatus = async (productId, newStatus) => {
    try {
      await api.put(`/products/${productId}/status`, null, {
        params: { newStatus },
      });
      await fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to change status");
    }
  };

  // Basic protection (front-end only)
  if (!user) {
    return (
      <>
        <TopNav />
        <div className="page-main">
          <h2>Admin Products</h2>
          <p style={{ color: "red" }}>Access denied. Please login as ADMIN.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <TopNav />

      <div className="page-main">
        {/* Header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
            alignItems: "center",
            gap: 12,
          }}
        >
          <div>
            <h2 style={{ marginBottom: 4 }}>Admin – All Products</h2>
            <p style={{ margin: 0 }}>
              Logged in as <strong>{user.fullname}</strong> ({user.email}){" "}
              <span style={{ fontStyle: "italic" }}>[ADMIN VIEW]</span>
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => navigate("/products/my")}
              className="btn btn-ghost"
              style={{ fontSize: 13 }}
            >
              My products
            </button>

            <button
              type="button"
              onClick={logout}
              className="btn btn-ghost"
              style={{ fontSize: 13 }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Filters */}
        <div className="filter-panel">
          <h3 style={{ marginTop: 0, marginBottom: 10 }}>Filters</h3>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <input
              placeholder="Filter by owner email..."
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
            />

            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Any status</option>
              {PRODUCT_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            <select
              value={deletedFilter}
              onChange={(e) => setDeletedFilter(e.target.value)}
            >
              <option value="ALL">All (active + deleted)</option>
              <option value="ONLY_ACTIVE">Only active</option>
              <option value="ONLY_DELETED">Only deleted</option>
            </select>

            {/* ✅ Styled Reload */}
            <button
              type="button"
              onClick={fetchProducts}
              className="btn btn-ghost btn-reload"
              disabled={loading}
              aria-busy={loading}
              title="Reload products"
              style={{ fontSize: 13 }}
            >
              <span className={"reload-icon" + (loading ? " spinning" : "")}>
                ⟳
              </span>
              {loading ? "Reloading..." : "Reload"}
            </button>
          </div>

          <p style={{ margin: "10px 0 0", fontSize: 12, color: "#556" }}>
            To restore: choose <strong>Only deleted</strong> then click{" "}
            <strong>Restore</strong>.
          </p>
        </div>

        {/* States */}
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p>No products match these filters.</p>
        )}

        {/* List */}
        <div style={{ display: "grid", gap: 12 }}>
          {products.map((p) => {
            const ownerN = pickOwnerName(p);
            const ownerE = pickOwnerEmail(p);

            return (
              <div
                key={p.id}
                className={
                  "product-card" + (p.deleted ? " product-card--deleted" : "")
                }
              >
                <div style={{ flex: 1 }}>
                  {/* Title row */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 6,
                      flexWrap: "wrap",
                    }}
                  >
                    <h3 style={{ margin: 0 }}>
                      {p.name}{" "}
                      {p.deleted && (
                        <span
                          style={{
                            marginLeft: 8,
                            fontSize: 12,
                            color: "#b91c1c",
                            border: "1px solid rgba(185, 28, 28, 0.45)",
                            padding: "2px 8px",
                            borderRadius: 999,
                            textTransform: "uppercase",
                            background: "rgba(185, 28, 28, 0.08)",
                          }}
                        >
                          deleted
                        </span>
                      )}
                    </h3>

                    {(ownerN || ownerE) && (
                      <span style={{ fontSize: 13, color: "#475569" }}>
                        Owner:{" "}
                        <strong>
                          {ownerN ? ownerN : "—"}
                          {ownerE ? ` (${ownerE})` : ""}
                        </strong>
                      </span>
                    )}
                  </div>

                  <p style={{ marginTop: 0 }}>{p.description}</p>

                  <p>
                    <strong>Category:</strong> {p.category} &nbsp; | &nbsp;
                    <strong>Status:</strong>{" "}
                    <span
                      style={{
                        color: STATUS_COLORS[p.status] || "gray",
                        fontWeight: 800,
                      }}
                    >
                      {String(p.status || "").replaceAll("_", " ")}
                    </span>
                  </p>

                  <p>
                    <strong>Harvest:</strong> {p.harvestDate || "—"}
                  </p>
                  <p>
                    <strong>Temp:</strong> {p.storageTemperature} °C &nbsp; |{" "}
                    &nbsp;
                    <strong>Humidity:</strong> {p.storageHumidity} %
                  </p>

                  <p style={{ fontSize: 12, color: "#64748b" }}>
                    Created: {p.createdAt || "—"} &nbsp; | &nbsp; Updated:{" "}
                    {p.updatedAt || "—"}
                  </p>

                  {/* Actions */}
                  <div
                    style={{
                      marginTop: 10,
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <label style={{ fontSize: 12 }}>
                      Change status:{" "}
                      <select
                        value={p.status}
                        onChange={(e) => handleChangeStatus(p.id, e.target.value)}
                        style={{ fontSize: 12 }}
                        disabled={!!p.deleted} // avoid changing status of deleted items
                      >
                        {PRODUCT_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <button
                      type="button"
                      className="btn btn-ghost"
                      style={{ fontSize: 12 }}
                      onClick={() => navigate(`/products/${p.id}/history`)}
                    >
                      History
                    </button>

                    {/* ✅ Restore asks confirmation */}
                    {p.deleted && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ fontSize: 12 }}
                        onClick={() => setRestoreTarget(p)}
                      >
                        Restore
                      </button>
                    )}
                  </div>

                  {/* History quick view */}
                  {p.history && p.history.length > 0 && (
                    <details style={{ marginTop: 10 }}>
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
              </div>
            );
          })}
        </div>
      </div>

      {/* ✅ Restore Confirmation Modal */}
      {restoreTarget && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3 style={{ marginTop: 0 }}>Restore product?</h3>
            <p style={{ margin: "8px 0 0" }}>
              Do you want to restore <strong>{restoreTarget.name}</strong>?
            </p>
            <p style={{ margin: "6px 0 0", fontSize: 12, color: "#64748b" }}>
              This will reactivate the product (soft delete = false).
            </p>

            <div
              className="modal-actions"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 16,
              }}
            >
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setRestoreTarget(null)}
                disabled={restoring}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleRestoreConfirmed}
                disabled={restoring}
              >
                {restoring ? "Restoring..." : "Yes, restore"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProductsPage;
