// import React, { useState } from "react";
// import api from "../api/axios";
// import { useAuth } from "../context/AuthContext";
// import { toApiUrl } from "../utils/url";

// const MyProfilePage = () => {
//   const { user, setUser, logout } = useAuth(); // ensure AuthContext exposes setUser
//   const [avatarFile, setAvatarFile] = useState(null);
//   const [avatarUploading, setAvatarUploading] = useState(false);
//   const [error, setError] = useState("");

//   const handleAvatarChange = (e) => {
//     setAvatarFile(e.target.files?.[0] || null);
//   };

//   const handleAvatarUpload = async () => {
//     if (!avatarFile) return;

//     try {
//       setError("");
//       setAvatarUploading(true);

//       const formData = new FormData();
//       formData.append("file", avatarFile);

//       const uploadRes = await api.post("/files/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       const imageUrl = uploadRes.data.url;

//       // Update user on backend (assuming /users/me supports avatarUrl)
//       await api.put("/users/me", {
//         ...user,
//         avatarUrl: imageUrl,
//       });

//       // Update context
//       const updatedUser = { ...user, avatarUrl: imageUrl };
//       setUser(updatedUser);
//       localStorage.setItem("foodstock_user", JSON.stringify(updatedUser));
//       setAvatarFile(null);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to upload avatar.");
//     } finally {
//       setAvatarUploading(false);
//     }
//   };

//   return (
//     <div className="page-main">
//       {/* ... your header ... */}

//       <div className="form-card">
//         <h3 style={{ marginTop: 0 }}>My profile</h3>

//         {/* Avatar block */}
//         <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
//           <div
//             style={{
//               width: 64,
//               height: 64,
//               borderRadius: "999px",
//               overflow: "hidden",
//               background: "#e5e7eb",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: 24,
//               fontWeight: 700,
//               color: "#4b5563",
//             }}
//           >
//             {user?.avatarUrl ? (
//               <img
//                 src={toApiUrl(user.avatarUrl)}
//                 alt={user.fullname}
//                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
//               />
//             ) : (
//               (user?.fullname?.[0] || "?").toUpperCase()
//             )}
//           </div>

//           <div>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleAvatarChange}
//               style={{ marginBottom: 6 }}
//             />
//             <br />
//             <button
//               type="button"
//               onClick={handleAvatarUpload}
//               disabled={!avatarFile || avatarUploading}
//               style={{
//                 borderRadius: 999,
//                 padding: "4px 12px",
//                 border: "none",
//                 background:
//                   "linear-gradient(90deg, #22c55e 0%, #84cc16 100%)",
//                 color: "#f9fafb",
//                 fontSize: 12,
//                 cursor: avatarFile ? "pointer" : "not-allowed",
//               }}
//             >
//               {avatarUploading ? "Uploading..." : "Upload avatar"}
//             </button>
//           </div>
//         </div>

//         {error && <p style={{ color: "red" }}>{error}</p>}

//         {/* ... rest of profile form (fullname, email, password, etc.) ... */}
//       </div>
//     </div>
//   );
// };

// export default MyProfilePage;
