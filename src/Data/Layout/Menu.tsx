import { MenuItem } from "@/Types/LayoutTypes";

export const MenuList: MenuItem[] | undefined = [
  {
    title: "General",
    lanClass: "lan-1",
    menucontent: "Dashboards,Widgets",
    Items: [
      // {
      //   title: "Dashboards",
      //   id: 1,
      //   icon: "home",
      //   type: "sub",
      //   lanClass: "lan-3",
      //   children: [
      //     { path: "/dashboard/default_dashboard", title: "Default", type: "link", lanClass: "lan-4" },
      //     { path: "/dashboard/project", title: "Project", type: "link", lanClass: "lan-5" },
      //     { path: "/dashboard/ecommerce", title: "Ecommerce", type: "link" },
      //     { path: "/dashboard/education", title: "Education", type: "link" },
      //   ],
      // },
      // {
      //   title: "Widgets",
      //   id: 2,
      //   icon: "widget",
      //   type: "sub",
      //   lanClass: "lan-6",
      //   active: false,
      //   children: [
      //     { path: "/widgets/general", title: "General", type: "link" },
      //     { path: "/widgets/chart", title: "Chart", type: "link" },
      //   ],
      // },
    ],
  },

  {
    title: "BYC Pages",
    lanClass: "lan-8",
    menucontent: "BYC Pages to use",
    Items: [
      {
        title: "Ben Yala Exchange",
        id: 3,
        icon: "ui-kits",
        type: "sub",
        active: false,
        children: [
          {
            path: "/Byc_Pages/Update_Profile",
            type: "link",
            title: "Update Profile",
          },
          {
            path: "/Byc_Pages/Language_Selection",
            type: "link",
            title: "Language Selection",
          },
          {
            path: "/Byc_Pages/Notification",
            type: "link",
            title: "Notification Selection",
          },
        ],
      },
    ],
  },

  // {
  //   title: "Applications",
  //   lanClass: "lan-8",
  //   menucontent: "Ready to use Apps",
  //   Items: [
  //     {
  //       title: "Project",
  //       id: 3,
  //       icon: "project",
  //       type: "sub",
  //       active: false,
  //       children: [
  //         {
  //           path: "/project/project_list",
  //           type: "link",
  //           title: "Project List",
  //         },
  //         { path: "/project/new_project", type: "link", title: "Create New" },
  //       ],
  //     },
  //     {
  //       title: "Ecommerce",
  //       id: 6,
  //       icon: "ecommerce",
  //       type: "sub",
  //       active: false,
  //       children: [
  //         {
  //           path: "/ecommerce/product_list",
  //           title: "Product List",
  //           type: "link",
  //         },
  //         { path: "/ecommerce/checkout", title: "Checkout", type: "link" },
  //       ],
  //     },
  //     // {
  //     //   title: "Users",
  //     //   icon: "user",
  //     //   type: "sub",
  //     //   active: false,
  //     //   children: [
  //     //     { path: "/users/edit_profile", type: "link", title: "User Edit" },
  //     //   ],
  //     // },
  //     // { path: "/app/todo_app", icon: "to-do", type: "link", title: "Todo" },
  //     // { path: "/app/search_website", icon: "search", type: "link", title: "Search Result" },
  //   ],
  // },
  // {
  //   title: "Forms & Table",
  //   menucontent: "Ready to use forms & tables",
  //   Items: [
  //     {
  //       title: "Forms",
  //       id: 17,
  //       icon: "form",
  //       type: "sub",
  //       active: false,
  //       children: [
  //         {
  //           title: "Form Controls",
  //           type: "sub",
  //           children: [
  //             {
  //               path: "/forms/form_controls/validation_form",
  //               title: "Form Validation",
  //               type: "link",
  //             },
  //             {
  //               path: "/forms/form_controls/base_input",
  //               title: "Base Inputs",
  //               type: "link",
  //             },
  //             // { path: "/forms/form_controls/radio_&_checkbox", title: "Checkbox & Radio", type: "link" },
  //             {
  //               path: "/forms/form_controls/input_groups",
  //               title: "Input Groups",
  //               type: "link",
  //             },
  //             // { path: "/forms/form_controls/input_mask", title: "Input Mask", type: "link" },
  //             {
  //               path: "/forms/form_controls/mega_option",
  //               title: "Mega Option",
  //               type: "link",
  //             },
  //           ],
  //         },
  //         {
  //           title: "Form Widget",
  //           type: "sub",
  //           children: [
  //             {
  //               path: "/forms/form_widget/datepicker",
  //               title: "Datepicker",
  //               type: "link",
  //             },
  //             {
  //               path: "/forms/form_widget/switch",
  //               title: "Switch",
  //               type: "link",
  //             },
  //             // { path: "/forms/form_widget/typeahead", title: "Typeahead", type: "link" },
  //           ],
  //         },
  //         // {
  //         //   title: "Form Layout",
  //         //   type: "sub",
  //         //   children: [
  //         //     { path: "/forms/form_layout/two_factor", title: "Two Factor", type: "link" },
  //         //   ],
  //         // },
  //       ],
  //     },

  //     {
  //       title: "Table",
  //       icon: "table",
  //       id: 18,
  //       type: "sub",
  //       children: [
  //         {
  //           title: "Data Tables",
  //           type: "sub",
  //           children: [
  //             {
  //               path: "/table/data_table/basic_init",
  //               title: "Basic Init",
  //               type: "link",
  //             },
  //             {
  //               path: "/table/data_table/advance_init",
  //               title: "Advance Init",
  //               type: "link",
  //             },
  //             { path: "/table/data_table/api", title: "API", type: "link" },
  //             {
  //               path: "/table/data_table/data_sources",
  //               title: "Data Source",
  //               type: "link",
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   title: "Components",
  //   menucontent: "UI Components & Elements",
  //   Items: [
  //     {
  //       title: "Ui-Kits",
  //       icon: "ui-kits",
  //       id: 19,
  //       type: "sub",
  //       active: false,
  //       children: [
  //         { path: "/ui_kits/modal", title: "Modal", type: "link" },
  //         { path: "/ui_kits/alert", title: "Alert", type: "link" },
  //         { path: "/ui_kits/tooltip", title: "Tooltip", type: "link" },
  //       ],
  //     },

  //     {
  //       title: "Bonus-Ui",
  //       icon: "bonus-kit",
  //       id: 20,
  //       type: "sub",
  //       active: false,
  //       children: [
  //         { path: "/bonus_ui/scrollable", title: "Scrollable", type: "link" },
  //         { path: "/bonus_ui/toasts", title: "Toasts", type: "link" },
  //         { path: "/bonus_ui/dropzone", title: "Dropzone", type: "link" },
  //         {
  //           path: "/bonus_ui/sweetalert_2",
  //           title: "SweetAlert2",
  //           type: "link",
  //         },
  //         { path: "/bonus_ui/pagination", title: "Pagination", type: "link" },
  //         { path: "/bonus_ui/breadcrumb", title: "Breadcrumb", type: "link" },
  //       ],
  //     },
  //     {
  //       title: "Buttons",
  //       icon: "button",
  //       id: 22,
  //       type: "sub",
  //       active: false,
  //       children: [
  //         {
  //           path: "/buttons/default_style",
  //           title: "Default Style",
  //           type: "link",
  //         },
  //       ],
  //     },

  //     {
  //       title: "Charts",
  //       icon: "charts",
  //       type: "sub",
  //       id: 23,
  //       active: false,
  //       children: [
  //         { path: "/charts/apex_chart", type: "link", title: "Apex Chart" },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   title: "Pages",
  //   menucontent: "All neccesory pages added",
  //   Items: [
  //     {
  //       icon: "sample-page",
  //       id: 24,
  //       active: false,
  //       path: "/pages/sample_page",
  //       title: "Sample Page",
  //       type: "link",
  //     },
  //     {
  //       title: "Others",
  //       icon: "others",
  //       id: 25,
  //       type: "sub",
  //       children: [
  //         // {
  //         //   title: "Error Pages",
  //         //   type: "sub",
  //         //   children: [
  //         //     { path: "/others/errors/error400", title: "Error 400", type: "link" },
  //         //     { path: "/others/errors/error401", title: "Error 401", type: "link" },
  //         //     { path: "/others/errors/error403", title: "Error 403", type: "link" },
  //         //     { path: "/others/errors/error404", title: "Error 404", type: "link" },
  //         //     { path: "/others/errors/error500", title: "Error 500", type: "link" },
  //         //     { path: "/others/errors/error503", title: "Error 503", type: "link" },
  //         //   ],
  //         // },
  //         {
  //           title: "Authentication",
  //           type: "sub",
  //           children: [
  //             {
  //               path: "/others/authentication/loginsimple",
  //               title: "Login Simple",
  //               type: "link",
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   title: "Miscellaneous",
  //   menucontent: "Bonus Pages & Apps",
  //   Items: [
  //     {
  //       title: "Gallery",
  //       icon: "gallery",
  //       id: 26,
  //       type: "sub",
  //       active: false,
  //       children: [
  //         {
  //           path: "/gallery/gallery_grids",
  //           title: "Gallery Grids",
  //           type: "link",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Editor",
  //       id: 31,
  //       icon: "editors",
  //       type: "sub",
  //       active: false,
  //       children: [
  //         { path: "/editor/mde_editor", type: "link", title: "MDE Editor" },
  //       ],
  //     },
  //   ],
  // },
];
