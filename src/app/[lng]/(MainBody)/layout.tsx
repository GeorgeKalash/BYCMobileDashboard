"use client";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { setToggleSidebar } from "@/Redux/Reducers/LayoutSlice";
import { setLayout } from "@/Redux/Reducers/ThemeCustomizerSlice";
import { logout } from "@/Redux/Reducers/AuthSlice";
import Store from "@/Redux/Store";
import { SideBar } from "@/Layout/Sidebar/Sidebar";
import ThemeCustomizer from "@/Layout/ThemeCustomizer";
import { Header } from "@/Layout/Header/Header";
import TapTop from "@/Layout/TapTop";
import { ToastContainer } from "react-toastify";
import "../../../../src/index.scss";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { layout } = useAppSelector((state) => state.themeCustomizer);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const sessionData = sessionStorage.getItem("userData");
    const localData = localStorage.getItem("userData");

    if (!sessionData && localData) {
      sessionStorage.setItem("userData", localData);
    }

    if (!sessionData && !localData) {
      dispatch(logout());
    }

    setIsReady(true);
  }, [dispatch]);

  const compactSidebar = () => {
    const windowWidth = window.innerWidth;
    if (layout === "compact-wrapper") {
      dispatch(setToggleSidebar(windowWidth < 1200));
    } else if (layout === "horizontal-wrapper") {
      if (windowWidth < 992) {
        dispatch(setToggleSidebar(true));
        dispatch(setLayout("compact-wrapper"));
      } else {
        dispatch(setToggleSidebar(false));
        dispatch(setLayout(localStorage.getItem("layout")));
      }
    }
  };

  useEffect(() => {
    compactSidebar();
    window.addEventListener("resize", compactSidebar);
    return () => window.removeEventListener("resize", compactSidebar);
  }, [layout]);

  if (!isReady) return null;

  return (
    <Provider store={Store}>
      <div className={`page-wrapper ${layout}`} id="pageWrapper">
        <Header />
        <div className="page-body-wrapper">
          <SideBar />
          <div className="page-body">{children}</div>
        </div>
      </div>
      <ThemeCustomizer />
      <ToastContainer />
      <TapTop />
    </Provider>
  );
}
