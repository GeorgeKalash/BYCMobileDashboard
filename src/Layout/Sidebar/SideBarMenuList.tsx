import { useAppSelector } from "@/Redux/Hooks";
import { Fragment, useState } from "react";
import { MenuList } from "@/Data/Layout/Menu";
import { MenuItem } from "@/Types/LayoutTypes";
import Menulist from "./Menulist";
import { useTranslation } from "@/app/i18n/client";

const SidebarMenuList = () => {
  const [activeMenu, setActiveMenu] = useState([]);
  const { pinedMenu } = useAppSelector((state) => state.layout);
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const shouldHideMenu = (mainMenu: MenuItem) => {return mainMenu?.Items?.map((data) => data.title).every((titles) =>pinedMenu.includes(titles || ""));};

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
