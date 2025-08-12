"use client";

import React from "react";
import { useAppSelector } from "@/Redux/Hooks";
import SharedModal from "@/Shared/Components/SharedModal";
import { useTranslation } from "@/app/i18n/client";

const GlobalErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const errorMessage = useAppSelector((state) => state.error.message);
  const { t } = useTranslation("en");

  if (errorMessage) {
    return (
      <SharedModal
        visible={true}
        onClose={() => window.location.reload()}
        title={t("Error")}
        width="500px"
        height="100px"
      >
        <div style={{ color: "red", whiteSpace: "pre-wrap" }}>
          {errorMessage}
        </div>
      </SharedModal>
    );
  }

  return <>{children}</>;
};

export default GlobalErrorBoundary;
