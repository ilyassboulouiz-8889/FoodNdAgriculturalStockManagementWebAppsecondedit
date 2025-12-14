// src/components/TopNav.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toApiUrl } from "../utils/url";

const getInitials = (fullname) => {
  if (!fullname) return "FS";
  const parts = fullname
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0].toUpperCase());
  if (parts.length === 0) return "FS";
  if (parts.length === 1) return parts[0];
  return (parts[0] + parts[1]).slice(0, 2);
};

const TopNav = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false); // user chip menu
  const chipRef = useRef(null);

  const isAdmin = user?.role === "ADMIN";

  const [adminOpen, setAdminOpen] = useState(false);
  const adminRef = useRef(null);

  const isActive = (path) => location.pathname.startsWith(path);
  const isAdminActive =
    isActive("/admin/products") || isActive("/admin/users");

  const avatarSrc = user?.avatarUrl ? toApiUrl(user.avatarUrl) : null;
  const initials = getInitials(user?.fullname);

  const handleLogout = () => {
    setMenuOpen(false);
    setAdminOpen(false);
    logout();
  };

  // close menus when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (chipRef.current && chipRef.current.contains(e.target)) return;
      if (adminRef.current && adminRef.current.contains(e.target)) return;

      setMenuOpen(false);
      setAdminOpen(false);
    };

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setAdminOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <nav className="app-nav">
        {/* Left: brand */}
        <div className="app-nav-left" onClick={() => navigate("/products/my")}>
          <div className="app-logo-mark">FS</div>
          <div className="app-logo-text">
            <span className="app-logo-title">Food Stock</span>
            <span className="app-logo-subtitle">
              Quality &amp; inventory monitor
            </span>
          </div>
        </div>

        {/* Center: links */}
        <div className="app-nav-center">
          <button
            className={`app-nav-link ${isActive("/products/my") ? "active" : ""}`}
            onClick={() => navigate("/products/my")}
          >
            My products
          </button>

          <button
            className={`app-nav-link ${isActive("/products/add") ? "active" : ""}`}
            onClick={() => navigate("/products/add")}
          >
            Add product
          </button>

          {/* ✅ Single Admin dropdown */}
          {isAdmin && (
            <div
              ref={adminRef}
              style={{ position: "relative", display: "inline-flex" }}
              onMouseEnter={() => setAdminOpen(true)}
              onMouseLeave={() => setAdminOpen(false)}
            >
              <button
                type="button"
                className={`app-nav-link ${isAdminActive ? "active" : ""}`}
                onClick={() => setAdminOpen((v) => !v)} // click toggle (mobile)
                aria-haspopup="menu"
                aria-expanded={adminOpen}
              >
                Admin{" "}
                <span style={{ marginLeft: 6, fontSize: 10 }}>
                  {adminOpen ? "▲" : "▼"}
                </span>
              </button>

              {adminOpen && (
                <div
                  className="user-menu"
                  role="menu"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: 0,
                    minWidth: 180,
                    zIndex: 30,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="user-menu-item"
                    type="button"
                    onClick={() => {
                      setAdminOpen(false);
                      navigate("/admin/products");
                    }}
                  >
                    Admin products
                  </button>

                  <button
                    className="user-menu-item"
                    type="button"
                    onClick={() => {
                      setAdminOpen(false);
                      navigate("/admin/users");
                    }}
                  >
                    Admin users
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            className={`app-nav-link ${isActive("/profile") ? "active" : ""}`}
            onClick={() => navigate("/profile")}
          >
            My profile
          </button>
        </div>

        {/* Right: user chip */}
        <div className="app-nav-right">
          {user && (
            <div
              ref={chipRef}
              className="user-chip"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <div className="user-avatar">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt="Avatar"
                    className="user-avatar-img"
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>

              <div className="user-meta">
                <span className="user-name">{user.fullname}</span>
                <span className="user-email-role">
                  <span className="user-email-small">{user.email}</span>
                  {user.role && <span className="role-pill">{user.role}</span>}
                </span>
              </div>

              <span className="user-chevron">{menuOpen ? "▲" : "▼"}</span>

              {menuOpen && (
                <div className="user-menu" onClick={(e) => e.stopPropagation()}>
                  <div className="user-menu-header">
                    <div className="user-avatar sm">
                      {avatarSrc ? (
                        <img
                          src={avatarSrc}
                          alt="Avatar small"
                          className="user-avatar-img"
                        />
                      ) : (
                        <span>{initials}</span>
                      )}
                    </div>
                    <div>
                      <div className="user-name">{user.fullname}</div>
                      <div className="user-email-small">{user.email}</div>
                    </div>
                  </div>

                  <button
                    className="user-menu-item"
                    type="button"
                    onClick={() => navigate("/profile")}
                  >
                    My profile
                  </button>

                  <button
                    className="user-menu-item"
                    type="button"
                    onClick={() => navigate("/products/my")}
                  >
                    My products
                  </button>

                  {/* optional quick links inside user dropdown */}
                  {isAdmin && (
                    <>
                      <button
                        className="user-menu-item"
                        type="button"
                        onClick={() => navigate("/admin/products")}
                      >
                        Admin products
                      </button>
                      <button
                        className="user-menu-item"
                        type="button"
                        onClick={() => navigate("/admin/users")}
                      >
                        Admin users
                      </button>
                    </>
                  )}

                  <button
                    className="user-menu-item"
                    type="button"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default TopNav;
