// src/pages/AdminUsersPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import TopNav from "../components/TopNav";

const ROLE_OPTIONS = ["USER", "ADMIN"];

const AdminUsersPage = () => {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // filters
  const [query, setQuery] = useState("");
  const [deletedFilter, setDeletedFilter] = useState("ONLY_ACTIVE"); // ALL | ONLY_ACTIVE | ONLY_DELETED

  // modals
  const [deleteTarget, setDeleteTarget] = useState(null); // user object
  const [restoreTarget, setRestoreTarget] = useState(null); // user object
  const [busyId, setBusyId] = useState(null); // id being updated/deleted/restored

  const params = useMemo(() => {
    const p = {};
    if (query.trim()) p.query = query.trim();
    if (deletedFilter) p.deletedFilter = deletedFilter;
    return p;
  }, [query, deletedFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/admin/users", { params });
      setUsers(res.data || []);
    } catch (e) {
      console.error(e);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- actions ----
  const changeRole = async (targetUserId, newRole) => {
    try {
      setBusyId(targetUserId);
      await api.put(`/admin/users/${targetUserId}/role`, null, {
        params: { newRole },
      });
      await fetchUsers();
    } catch (e) {
      console.error(e);
      alert("Failed to change role");
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget?.id) return;

    // safety: don’t allow deleting yourself
    if (user?.id && deleteTarget.id === user.id) {
      alert("You cannot delete your own account.");
      setDeleteTarget(null);
      return;
    }

    try {
      setBusyId(deleteTarget.id);
      await api.delete(`/admin/users/${deleteTarget.id}`);
      setDeleteTarget(null);
      await fetchUsers();
    } catch (e) {
      console.error(e);
      alert("Failed to delete user");
    } finally {
      setBusyId(null);
    }
  };

  const confirmRestore = async () => {
    if (!restoreTarget?.id) return;

    try {
      setBusyId(restoreTarget.id);
      await api.put(`/admin/users/${restoreTarget.id}/restore`);
      setRestoreTarget(null);
      await fetchUsers();
    } catch (e) {
      console.error(e);
      alert("Failed to restore user");
    } finally {
      setBusyId(null);
    }
  };

  // Basic protection (front-end only)
  if (!user || user.role !== "ADMIN") {
    return (
      <>
        <TopNav />
        <div className="page-main">
          <h2>Admin Users</h2>
          <p style={{ color: "red" }}>Access denied. Admin only.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <TopNav />

      <div className="page-main">
        <header style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ marginBottom: 4 }}>Admin – Users</h2>
            <p style={{ margin: 0, color: "#475569" }}>
              Manage user accounts (roles + soft delete + restore)
            </p>
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-reload"
            onClick={fetchUsers}
            disabled={loading}
            aria-busy={loading}
            title="Reload users"
            style={{ fontSize: 13 }}
          >
            <span className={"reload-icon" + (loading ? " spinning" : "")}>⟳</span>
            {loading ? "Reloading..." : "Reload"}
          </button>
        </header>

        {/* Filters */}
        <div className="filter-panel" style={{ marginTop: 16 }}>
          <h3 style={{ marginTop: 0, marginBottom: 10 }}>Filters</h3>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <input
              placeholder="Search by name or email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ minWidth: 260 }}
            />

            <select value={deletedFilter} onChange={(e) => setDeletedFilter(e.target.value)}>
              <option value="ALL">All (active + deleted)</option>
              <option value="ONLY_ACTIVE">Only active</option>
              <option value="ONLY_DELETED">Only deleted</option>
            </select>

            <button type="button" className="btn btn-primary" onClick={fetchUsers} disabled={loading}>
              Apply
            </button>
          </div>

          <p style={{ margin: "10px 0 0", fontSize: 12, color: "#556" }}>
            Tip: choose <strong>Only deleted</strong> to restore accounts.
          </p>
        </div>

        {/* States */}
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && users.length === 0 && <p>No users found.</p>}

        {/* List */}
        <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
          {users.map((u) => {
            const isBusy = busyId === u.id;
            const isSelf = user?.id && u.id === user.id;

            return (
              <div
                key={u.id}
                className={"product-card" + (u.deleted ? " product-card--deleted" : "")}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                    <h3 style={{ margin: 0 }}>
                      {u.fullname || "—"}
                      {u.deleted && (
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
                      {isSelf && (
                        <span
                          style={{
                            marginLeft: 8,
                            fontSize: 12,
                            color: "#0f766e",
                            border: "1px solid rgba(15, 118, 110, 0.35)",
                            padding: "2px 8px",
                            borderRadius: 999,
                            background: "rgba(15, 118, 110, 0.08)",
                          }}
                        >
                          you
                        </span>
                      )}
                    </h3>

                    <div style={{ fontSize: 13, color: "#475569" }}>
                      <strong>{u.email}</strong>
                    </div>
                  </div>

                  <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 12 }}>
                    User ID: {u.id} {u.createdAt ? ` • Created: ${u.createdAt}` : ""}
                  </p>

                  <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                    {/* Role */}
                    <label style={{ fontSize: 12 }}>
                      Role:{" "}
                      <select
                        value={u.role || "USER"}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                        disabled={u.deleted || isBusy || isSelf} // optional: block self role change
                        style={{ fontSize: 12 }}
                      >
                        {ROLE_OPTIONS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </label>

                    {/* Actions */}
                    {!u.deleted ? (
                      <button
                        type="button"
                        className="btn btn-ghost"
                        style={{ fontSize: 12 }}
                        disabled={isBusy || isSelf}
                        onClick={() => setDeleteTarget(u)}
                      >
                        Delete
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ fontSize: 12 }}
                        disabled={isBusy}
                        onClick={() => setRestoreTarget(u)}
                      >
                        Restore
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ✅ Delete Confirmation Modal (same style pattern) */}
      {deleteTarget && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3 style={{ marginTop: 0 }}>Delete user?</h3>
            <p style={{ margin: "8px 0 0" }}>
              Do you want to delete <strong>{deleteTarget.fullname}</strong> ({deleteTarget.email})?
            </p>
            <p style={{ margin: "6px 0 0", fontSize: 12, color: "#64748b" }}>
              This is a <strong>soft delete</strong> (deleted = true). You can restore later.
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setDeleteTarget(null)}
                disabled={busyId === deleteTarget.id}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={confirmDelete}
                disabled={busyId === deleteTarget.id}
              >
                {busyId === deleteTarget.id ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Restore Confirmation Modal (same style pattern) */}
      {restoreTarget && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3 style={{ marginTop: 0 }}>Restore user?</h3>
            <p style={{ margin: "8px 0 0" }}>
              Do you want to restore <strong>{restoreTarget.fullname}</strong> ({restoreTarget.email})?
            </p>
            <p style={{ margin: "6px 0 0", fontSize: 12, color: "#64748b" }}>
              This will reactivate the account (deleted = false).
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setRestoreTarget(null)}
                disabled={busyId === restoreTarget.id}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={confirmRestore}
                disabled={busyId === restoreTarget.id}
              >
                {busyId === restoreTarget.id ? "Restoring..." : "Yes, restore"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminUsersPage;
