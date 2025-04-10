import { configureStore } from "@reduxjs/toolkit";
import NumberingWizardSlice from "./Reducers/FormLayout/NumberingWizardSlice";
import StudentWizardSlice from "./Reducers/FormLayout/StudentWizardSlice";
import TwoFactorSlice from "./Reducers/FormLayout/TwoFactorSlice";
import VerticalWizardSlice from "./Reducers/FormLayout/VerticalWizardSlice";
import LanguageSlice from "./Reducers/LanguageSlice";
import AuthSlice from "./Reducers/AuthSlice";
import LayoutSlice from "./Reducers/LayoutSlice";
import ProjectSlice from "./Reducers/ProjectSlice";
import ToDoSlice from "./Reducers/ToDoSlice";
import ProductSlice from "./Reducers/ProductSlice";
import FilterSlice from "./Reducers/FilterSlice";
import LetterBoxSlice from "./Reducers/LetterBoxSlice";
import ThemeCustomizerSlice from "./Reducers/ThemeCustomizerSlice";

const Store = configureStore({
  reducer: {
    authSlice: AuthSlice,
    layout: LayoutSlice,
    twoFactor: TwoFactorSlice,
    numberingWizard: NumberingWizardSlice,
    studentWizard: StudentWizardSlice,
    verticalWizard: VerticalWizardSlice,
    project: ProjectSlice,
    langSlice: LanguageSlice,
    todo:ToDoSlice,
    product:ProductSlice,
    filterData: FilterSlice,
    letterBox:LetterBoxSlice,
    themeCustomizer: ThemeCustomizerSlice,
  },
});

export default Store;

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
