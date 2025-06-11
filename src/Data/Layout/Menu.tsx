import { MenuItem } from "@/Types/LayoutTypes";

export const MenuList: MenuItem[] | undefined = [
  {
    title: "Navigation Menu",
    lanClass: "lan-8",
    menucontent: "BYC Pages to use",
    Items: [
      {
        path: "/Byc_Pages/Defaults",
        type: "link",
        title: "Defaults",
        icon: "ui-kits",
      },
      {
        path: "/Byc_Pages/Language_Selection",
        type: "link",
        title: "Languages Page",
        icon: "ui-kits",
      },
      {
        path: "/Byc_Pages/Text_Control",
        type: "link",
        title: "Text Control",
        icon: "ui-kits",
      },
      {
        path: "/Byc_Pages/Notification",
        type: "link",
        title: "Notifications",
        icon: "ui-kits",
      },
      {
        path: "/Byc_Pages/Requests",
        type: "link",
        title: "Requests",
        icon: "ui-kits",
      },
      {
        path: "/Byc_Pages/Slider_Image_Attachment",
        type: "link",
        title: "Slider Image Attachment",
        icon: "ui-kits",
      },
    ],
  },
];
