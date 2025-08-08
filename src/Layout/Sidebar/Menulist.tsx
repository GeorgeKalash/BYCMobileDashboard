import React, { useState, useEffect } from "react";
import SVG from "@/CommonComponent/SVG";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { handlePined } from "@/Redux/Reducers/LayoutSlice";
import { MenuListType, SidebarItemTypes } from "@/Types/LayoutTypes";
import { useTranslation } from "@/app/i18n/client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Menulist: React.FC<MenuListType> = ({ menu, setActiveMenu, activeMenu, level, className }) => {
  const { pinedMenu } = useAppSelector((state) => state.layout);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const { sidebarIconType } = useAppSelector((state) => state.themeCustomizer);

  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const ActiveNavLinkUrl = (path?: string, active?: boolean) => {
    return pathname.split(`${i18LangStatus}`)[1] === path ? (active ? active : true) : "";
  };

  const shouldSetActive = ({ item }: SidebarItemTypes): boolean => {
    let returnValue = false;
    if (item?.path === pathname.split(`${i18LangStatus}`)[1]) returnValue = true;
    if (!returnValue && item?.children) {
      item?.children.every((subItem) => {
        returnValue = shouldSetActive({ item: subItem });
        return !returnValue;
      });
    }
    return returnValue;
  };

  useEffect(() => {
    menu?.forEach((item: any) => {
      let gotValue = shouldSetActive({ item });
      if (gotValue) {
        let temp = [...activeMenu];
        temp[level] = t(item.title);
        setActiveMenu(temp);

        if (item.children) {
          setExpandedMenu(item.title);
        }
      }
    });
  }, []);

  const toggleExpand = (title: string) => {
    if (expandedMenu === title) {
      setExpandedMenu(null);
    } else {
      setExpandedMenu(title);
    }
  };

  return (
    <>
      {menu?.map((item, index) => (
        <li
          key={index}
          className={`${level === 0 ? "sidebar-list" : ""} ${pinedMenu.includes(item.title || "") ? "pined" : ""}  ${
            (item.children
              ? item.children.map((innerItem) => ActiveNavLinkUrl(innerItem.path)).includes(true)
              : ActiveNavLinkUrl(item.path)) || activeMenu[level] === item.title
              ? "active"
              : ""
          } `}
        >
          {level === 0 && (
            <i
              className="fa fa-thumb-tack"
              onClick={() => dispatch(handlePined(item.title))}
              style={{ cursor: "pointer" }}
            ></i>
          )}

          <Link
            className={`${!className && level !== 2 ? "sidebar-link sidebar-title" : ""}  ${
              (item.children
                ? item.children.map((innerItem) => ActiveNavLinkUrl(innerItem.path)).includes(true)
                : ActiveNavLinkUrl(item.path)) || activeMenu[level] === item.title
                ? "active"
                : ""
            }`}
            href={item?.path ? `/${i18LangStatus}${item.path}` : "#"}
            onClick={(e) => {
              if (item.children) {
                e.preventDefault(); 
                toggleExpand(item.title);
              }
              const temp = activeMenu;
              temp[level] = item.title !== temp[level] && item.title;
              setActiveMenu([...temp]);
            }}
          >
            {item.icon && <SVG className={`${sidebarIconType}-icon`} iconId={`${sidebarIconType}-${item.icon}`} />}
            <span className={item.lanClass && item.lanClass}>{t(item.title)}</span>
            {item.children && <div className="according-menu"><i className="fa fa-angle-right" /></div>}
          </Link>

          {item.children && expandedMenu === item.title && (
            <ul>
              <Menulist menu={item.children} activeMenu={activeMenu} setActiveMenu={setActiveMenu} level={level + 1} />
            </ul>
          )}
        </li>
      ))}
    </>
  );
};

export default Menulist;
