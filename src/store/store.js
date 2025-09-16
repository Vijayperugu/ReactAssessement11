import { configureStore } from "@reduxjs/toolkit";
import appointmentsReducer from "../appointments/appointmentsSlice";

export const store = configureStore({
  reducer: {
    appointments: appointmentsReducer,
  },
});
