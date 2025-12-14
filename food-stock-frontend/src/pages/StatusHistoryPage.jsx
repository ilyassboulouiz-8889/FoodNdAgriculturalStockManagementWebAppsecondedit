import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { STATUS_COLORS } from "../constants/productStatus";
import { toApiUrl } from "../utils/url";

const StatusHistoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [product, setProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ image passed when clicking History button (best, because list page already has it)
  const passedImageUrl = location.state?.imageUrl || null;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError("");

        const [productRes, historyRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/history/product/${id}`),
        ]);

        const p = productRes.data;
        const h = Array.isArray(historyRes.data) ? historyRes.data : [];

        setProduct(p);

        const sorted = h.slice().sort((a, b) =>
          String(a.changedAt || "").localeCompare(String(b.changedAt || ""))
        );
        setHistory(sorted);
      } catch (err) {
        console.error(err);
        setError("Failed to load product history.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  // ✅ choose product image
  const imageUrl =
  history[0]?.imageUrl || product?.imageUrl || null;

const imageSrc = imageUrl ? toApiUrl(imageUrl) : null;

  if (loading) {
    return (
      <div className="page-main">
        <p>Loading history...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-main">
        <p style={{ color: "red" }}>{error || "Product not found."}</p>
      </div>
    );
  }

  return (
    <div className="page-main">
      <header className="page-header">
        <div>
          <h2>Status history</h2>

          <p className="page-subtitle" style={{ marginBottom: 6 }}>
            <strong>{product.name}</strong> &nbsp;•&nbsp; {product.category}{" "}
            &nbsp;|&nbsp; current status:{" "}
            <span
              style={{
                fontWeight: 700,
                color: STATUS_COLORS[product.status] || "#14532d",
              }}
            >
              {String(product.status).replace("_", " ")}
            </span>
          </p>

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

      <div className="form-card">
        {/* ✅ product row with image */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
          }}
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={product.name}
              style={{
                width: 64,
                height: 64,
                objectFit: "cover",
                borderRadius: 12,
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div style={{ fontSize: 12, color: "#6b7280" }}>No image</div>
          )}

          <div>
            <div style={{ fontWeight: 700 }}>{product.name}</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              {product.category}
            </div>
          </div>
        </div>

        <h3 className="form-title" style={{ marginBottom: 4 }}>
          Timeline
        </h3>
        <p className="form-description">
          Track how the quality status of this batch evolved over time.
        </p>

        {history.length === 0 ? (
          <p style={{ fontSize: 13, marginTop: 8 }}>
            No recorded status changes yet for this batch.
          </p>
        ) : (
          <div className="history-timeline">
            {history.map((h, index) => (
              <div className="history-item" key={h.id ?? index}>
                <div className="history-marker-col">
                  <div className="history-dot" />
                  {index < history.length - 1 && (
                    <div className="history-line" />
                  )}
                </div>

                <div className="history-content">
                  <div className="history-status-row">
                    <span
                      className="history-status-pill"
                      style={{
                        color: STATUS_COLORS[h.newStatus] || "#16a34a",
                        borderColor:
                          STATUS_COLORS[h.newStatus] ||
                          "rgba(22, 163, 74, 0.7)",
                      }}
                    >
                      {String(h.newStatus).replace("_", " ")}
                    </span>
                    <span className="history-date-label">{h.changedAt}</span>
                  </div>

                  {h.note && (
                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 13,
                        color: "#374151",
                      }}
                    >
                      {h.note}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusHistoryPage;