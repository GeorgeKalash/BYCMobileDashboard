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
      },
      {
        path: "/Byc_Pages/Users",
        type: "link",
        title: "Users",
      },
      {
        path: "/Byc_Pages/Requests",
        type: "link",
        title: "Requests",
      },
      {
        title: "Notifications",
        id: 1,
        type: "sub",
        lanClass: "lan-3",
        children: [
          {
            path: "/Byc_Pages/Notification",
            type: "link",
            title: "Notifications",
          },
          {
            path: "/Byc_Pages/Notification_Type",
            type: "link",
            title: "Notification Type",
          },
          {
            path: "/Byc_Pages/Notification_Template",
            type: "link",
            title: "Notifications Template",
          },
          {
            path: "/Byc_Pages/Notification_Group",
            type: "link",
            title: "Notification Group",
          },  
          {
            path: "/Byc_Pages/Notification_Alert",
            type: "link",
            title: "Notification Alert",
          },
        ],
      },
      {
        title: "Defaults",
        id: 1,
        type: "sub",
        lanClass: "lan-3",
        children: [
          {
            path: "/Byc_Pages/Defaults",
            type: "link",
            title: "Defaults",
          },
          {
            path: "/Byc_Pages/OTP_Control",
            type: "link",
            title: "OTP Control",
          },
        ],
      },
      {
        title: "Payment",
        id: 1,
        type: "sub",
        lanClass: "lan-3",
        children: [
          {
            path: "/Byc_Pages/Payment",
            type: "link",
            title: "Payment",
          },
          {
            path: "/Byc_Pages/Payments_History",
            type: "link",
            title: "Payments History",
          },
        ],
      },
      {
        path: "/Byc_Pages/Language_Selection",
        type: "link",
        title: "Languages Page",
      },
      {
        path: "/Byc_Pages/Text_Control",
        type: "link",
        title: "Text Control",
      },
      {
        path: "/Byc_Pages/Terms_And_Conditions",
        type: "link",
        title: "Terms And Conditions",
      },
      {
        path: "/Byc_Pages/Slider_Image_Attachment",
        type: "link",
        title: "Image Attechment",
      },
      {
        path: "/Byc_Pages/FAQ",
        type: "link",
        title: "FAQ",
      },
    ],
  },
];
