import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { setLanguage } from "@/Redux/Reducers/LanguageSlice";
import { setLanguageId } from "@/Redux/Reducers/AuthSlice";
import { ChangeLngType } from "@/Types/LayoutTypes";
import { useTranslation } from "@/app/i18n/client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import ConfigDB from "@/Config/ThemeConfig";
import axios from "axios";

const Languages = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { i18n } = useTranslation(i18LangStatus);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const LanguagesData = [
    {
      data: "en",
      logo: "flag-icon flag-icon-us",
      language: "English",
    },
    {
      data: "ae",
      logo: "flag-icon flag-icon-sa",
      language: "لعربية",
    },
  ];

  const changeLng = async (item: ChangeLngType) => {
    const numericLangId = item.data === "ae" ? 2 : 1;

    dispatch(setLanguage(item.data));
    dispatch(setLanguageId(numericLangId));

    i18n.changeLanguage(item.language);

    localStorage.setItem("lang", item.data);
    localStorage.setItem("dir", item.data === "ae" ? "rtl" : "ltr");
    localStorage.setItem("languageId", String(numericLangId));

    const userDataRaw = sessionStorage.getItem("userData");
    if (userDataRaw) {
      const userData = JSON.parse(userDataRaw);
      userData.languageId = numericLangId;
      sessionStorage.setItem("userData", JSON.stringify(userData));
    }

    if (item.data === "ae") {
      document.body.classList.add("rtl");
      document.body.classList.remove("ltr", "box-layout");
      document.documentElement.dir = "rtl";
      ConfigDB.data.settings.layout_type = "rtl";
    } else {
      document.body.classList.add("ltr");
      document.body.classList.remove("rtl", "box-layout");
      document.documentElement.dir = "ltr";
      ConfigDB.data.settings.layout_type = "ltr";
    }

    const languageCodeRegex = /^\/[a-z]{2}(\/|$)/;
    const updatedPath = pathname.replace(languageCodeRegex, `/${item.data}$1`);
    router.push(updatedPath);

    const userDataFromSession = sessionStorage.getItem("userData");
    if (userDataFromSession) {
      const userData = JSON.parse(userDataFromSession);
      const email = userData.username;

      const record = {
        userTypeName: "Super User.",
        employeeRef: null,
        employeeName: null,
        languageName: item.language,
        activeStatusName: "Active",
        nGroupName: null,
        nGroupRef: null,
        languageId: numericLangId,
        username: email,
        email: email,
        cellPhone: "",
        fullName: userData.fullName || email,
        activeStatus: 1,
        userType: 1,
        employeeId: null,
        notificationGroupId: null,
        menuTheme: 2,
        umcpnl: false,
        emailVerified: null,
        cellPhoneVerified: null,
        dashboardId: null,
        is2FAEnabled: null,
        otpDevice: null,
        platform: null,
        recordId: userData.userId,
      };

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_AuthURL1}/SS.asmx/setUS`,
          new URLSearchParams({
            record: JSON.stringify(record),
          }),
          {
            headers: {
              Authorization: `Bearer ${userData.accessToken}`,
              LanguageId: String(numericLangId),
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        if (response.data) {
          console.log("User updated successfully:", response.data);
        }
      } catch (err) {
        console.error("Error updating user data:", err);
      }
    }
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    const savedDir = localStorage.getItem("dir");
    const savedLanguageId = localStorage.getItem("languageId");

    if (savedLang && savedLanguageId) {
      dispatch(setLanguage(savedLang));
      dispatch(setLanguageId(Number(savedLanguageId)));

      i18n.changeLanguage(savedLang);

      if (savedDir === "rtl") {
        document.body.classList.add("rtl");
        document.body.classList.remove("ltr", "box-layout");
        document.documentElement.dir = "rtl";
        ConfigDB.data.settings.layout_type = "rtl";
      } else {
        document.body.classList.add("ltr");
        document.body.classList.remove("rtl", "box-layout");
        document.documentElement.dir = "ltr";
        ConfigDB.data.settings.layout_type = "ltr";
      }
    }
  }, [i18LangStatus, pathname, dispatch, i18n]);

  return (
    <li className="onhover-dropdown">
      <div className="cart-box text-uppercase f-w-700">{i18LangStatus}</div>
      <div className="language-dropdown onhover-show-div language-width">
        <ul className="language-list">
          {LanguagesData.map((item, i) => (
            <li className="p-0" key={i} onClick={() => changeLng(item)}>
              <a className="text-decoration-none" data-lng={item.data}>
                <i className={item.logo} /> {item.language}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};

export default Languages;
