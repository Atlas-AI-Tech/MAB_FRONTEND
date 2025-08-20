import { createSlice } from "@reduxjs/toolkit";

// A slice to showcase all react components which are above rest of the components eg: Modal, tooltip, etc

const initialState = {
  isModalOpen: false,
};

const overlayElementsSlice = createSlice({
  name: "overlayElements",
  initialState,
  reducers: {
    updateIsModalOpen: (state, action) => {
      state.isModalOpen = action.payload; // only boolean values should be allowed
    },
  },
});

export const { updateIsModalOpen } = overlayElementsSlice.actions;

export default overlayElementsSlice.reducer;
