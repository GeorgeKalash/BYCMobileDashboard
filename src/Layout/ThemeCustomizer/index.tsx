import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { setOpenCus } from "@/Redux/Reducers/ThemeCustomizerSlice";
import { useState } from "react";
import TabCustomizer from "./TabCustomizer";

const ThemeCustomizer = () => {
  const [selected, setSelected] = useState("sidebar-type");
  const { openCus } = useAppSelector((state) => state.themeCustomizer);
  const dispatch = useAppDispatch();

  const callbackNav = (select: string, open: boolean) => {
    setSelected(select);
    dispatch(setOpenCus(open));
  };

  return (
    <>
      <div className={`customizer-contain ${openCus ? "open" : ""}`}>
        <TabCustomizer selected={selected} callbackNav={callbackNav} />
      </div>
    </>
  );
};

export default ThemeCustomizer;
