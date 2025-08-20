import { configureStore } from "@reduxjs/toolkit";
import currentUserSlice from "./currentUserSlice";
import ovelayElementsSlice from "./overlayElementsSlice";

const store = configureStore({
  reducer: {
    overlayElements: ovelayElementsSlice,
    currentUserInfo: currentUserSlice,
  },
});

export default store;
