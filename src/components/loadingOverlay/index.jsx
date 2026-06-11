// components/LoadingOverlay.js
import React from "react";

const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // پس‌زمینه نیمه شفاف
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  };

  const spinnerStyle = {
    width: "3rem",
    height: "3rem",
    border: "0.4rem solid #f3f3f3",
    borderTop: "0.4rem solid #3498db", // رنگ چرخش
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

  return (
    <div style={overlayStyle}>
      <div
        className="spinner-border text-primary" // استفاده از spinner آماده‌ی Bootstrap
        style={spinnerStyle}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
