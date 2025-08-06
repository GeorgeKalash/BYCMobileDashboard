import { Fragment, useState } from "react";
import { MenuList } from "@/Data/Layout/Menu";
import { MenuItem } from "@/Types/LayoutTypes";
import Menulist from "./Menulist";

const SidebarMenuList = () => {
  const [activeMenu, setActiveMenu] = useState([]);
  return (
    <>
      {MenuList &&
        MenuList.map((mainMenu: MenuItem, index) => (
          <Fragment key={index}>
            <Menulist menu={mainMenu.Items} activeMenu={activeMenu} setActiveMenu={setActiveMenu} level={0} />
          </Fragment>
        ))}
    </>
  );
};

export default SidebarMenuList;
