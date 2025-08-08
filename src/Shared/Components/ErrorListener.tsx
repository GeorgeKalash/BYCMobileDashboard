"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/Redux/Hooks";
import { clearError } from "@/Redux/Reducers/ErrorSlice";
import SharedModal from "@/Shared/Components/SharedModal";
import { useTranslation } from "@/app/i18n/client";

const ErrorListener = () => {
  const errorMessage = useAppSelector((state) => state.error.message);
  const dispatch = useAppDispatch();
  const { t } = useTranslation("en"); 

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      setModalVisible(true);
    }
  }, [errorMessage]);

  const handleClose = () => {
    setModalVisible(false);
    dispatch(clearError());
  };

  return (
    <SharedModal
      visible={modalVisible}
      onClose={handleClose}
      title={t("Error")}
      width="500px"
      height="100px"
    >
      <div style={{ color: "red", whiteSpace: "pre-wrap" }}>
        {errorMessage}
      </div>
    </SharedModal>
  );
};

export default ErrorListener;
