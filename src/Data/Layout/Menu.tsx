import { MenuItem } from "@/Types/LayoutTypes";

export const MenuList: MenuItem[] | undefined = [
   {
    title: "Navigation Menu",
    menucontent: "BYC Pages to use",
    lanClass: "lan-1",
    Items: [
      {
        path: "/Byc_Pages/Reports",
        type: "link",
        title: "Reports",
        icon: "ui-kits",
      },
      {
        path: "/Byc_Pages/Users",
        type: "link",
        title: "Users",
        icon: "ui-kits",
      },
      {
        path: "/Byc_Pages/Requests",
        type: "link",
        title: "Requests",
        icon: "ui-kits",
      },
      {
        title: "Notifications",
        id: 1,
        icon: "home",
        type: "sub",
        lanClass: "lan-3",
        children: [
          {
            path: "/Byc_Pages/Notification",
            type: "link",
            title: "Notifications",
            lanClass: "lan-4",
          },
          {
            path: "/Byc_Pages/Notification_Type",
            type: "link",
            title: "Notification Type",
            lanClass: "lan-4",
          },
          {
            path: "/Byc_Pages/Notification_Template",
            type: "link",
            title: "Notifications Template",
            lanClass: "lan-4",
          },
          {
            path: "/Byc_Pages/Notification_Group",
            type: "link",
            title: "Notification Group",
            lanClass: "lan-4",
          },
        ],
      },
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
        path: "/Byc_Pages/OTP_Control",
        type: "link",
        title: "OTP Control",
        icon: "ui-kits",
      },
      {
        path: "/Byc_Pages/Payments_History",
        type: "link",
        title: "Payments History",
        icon: "ui-kits",
      },
      {
        path: "/Byc_Pages/Slider_Image_Attachment",
        type: "link",
        title: "Image Attechment",
        icon: "ui-kits",
      },
      {
        path: "/Byc_Pages/FAQ",
        type: "link",
        title: "FAQ",
        icon: "ui-kits",
      },
      {
        path: "/Byc_Pages/Payment",
        type: "link",
        title: "Payment",
        icon: "ui-kits",
      },
      {
        path: "/Byc_Pages/Terms_And_Conditions",
        type: "link",
        title: "Terms And Conditions",
        icon: "ui-kits",
      },
    ],
  },
];
