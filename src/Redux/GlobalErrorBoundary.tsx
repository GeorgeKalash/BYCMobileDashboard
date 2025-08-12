"use client";

import React from "react";
import { useAppSelector, useAppDispatch } from "@/Redux/Hooks";
import { clearError } from "@/Redux/Reducers/ErrorSlice";
import { useTranslation } from "@/app/i18n/client";

const GlobalErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const errorMessage = useAppSelector((state) => state.error.message);
  const dispatch = useAppDispatch();
  const { t } = useTranslation("en");

  const handleClose = () => {
    dispatch(clearError());
  };

  if (errorMessage) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}
      >
        <div
          style={{
            padding: "20px",
            borderRadius: "8px",
            width: "500px",
            maxWidth: "90%",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          <h3 style={{ marginTop: 0 }}>{t("Error")}</h3>
          <p style={{ color: "red", whiteSpace: "pre-wrap" }}>{errorMessage}</p>
          <div style={{ textAlign: "right", marginTop: "15px" }}>
            <button
              onClick={handleClose}
              style={{
                padding: "8px 16px",
                backgroundColor: "#d33",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {t("Close")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default GlobalErrorBoundary;
