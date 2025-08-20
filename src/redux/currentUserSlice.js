import { createSlice } from "@reduxjs/toolkit";

// Stores current user's name, phone, company, and id
const initialState = {
  currentName: "",
  currentCompanyName: "",
  phoneNumber: "",
  userId: "",
};

const currentUserSlice = createSlice({
  name: "currentUserInfo",
  initialState,
  reducers: {
    updateUserInfo: (state, action) => {
      const { name, phone_number, company_name, uuid } = action.payload;
      state.currentName = name;
      state.currentCompanyName = company_name;
      state.phoneNumber = phone_number;
      state.userId = uuid;
    },
  },
});

export const { updateUserInfo } = currentUserSlice.actions;
export default currentUserSlice.reducer;
