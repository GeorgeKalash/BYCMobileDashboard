import { Row, Col } from "reactstrap";
import { MobileView } from "./MobileView";
import { BreadCrumbs } from "./BreadCrumbs";
import { PageHeader } from "./PageHeader";
import { PageName } from "./PageName";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { headerResponsive } from "@/Redux/Reducers/LayoutSlice";

export const Header = () => {
  const { toggleSidebar } = useAppSelector((state) => state.layout);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(headerResponsive());
  }, []);

  return (
    <Row
      className={`page-header py-0 my-1 gap-0 align-items-center lh-1 ${
        toggleSidebar ? "close_icon" : ""
      }`}
      id="page-header"
    >
      <MobileView />
      <PageName />
      <BreadCrumbs />
      <PageHeader />
    </Row>
  );
};
