"use client";

import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/Redux/Hooks";
import { clearError } from "@/Redux/Reducers/ErrorSlice";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const ErrorListener = () => {
  const errorMessage = useAppSelector((state) => state.error.message);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (errorMessage) {
      toast.error(t(errorMessage), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      dispatch(clearError());
    }
  }, [errorMessage, dispatch, t]);

  return null;
};

export default ErrorListener;
