import { createSlice } from "@reduxjs/toolkit";

const initialAppointments = [
  {
    id: 1,
    name: "John Doe",
    age: "28",
    phone: "+91 9876543215",
    drName: "Dr. Ananth",
    visitDate: "2021-02-02",
    visitTime: "06:00 PM",
    visitType: "Consult",
    gender: "Male",
  },
  {
    id: 2,
    name: "Mukul Rao",
    age: "28",
    phone: "+91 9876543215",
    drName: "Dr. Ananth",
    visitDate: "2021-02-02",
    visitTime: "06:00 PM",
    visitType: "Revisit",
    gender: "Male",
  },
];

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState: {
    appointments: initialAppointments,
    editedId: null,
    toast: null, 
  },
  reducers: {
    addAppointment: (state, action) => {
      const nextId = state.appointments.length
        ? Math.max(...state.appointments.map((a) => a.id)) + 1
        : 1;
      state.appointments.push({ ...action.payload, id: nextId });
    },
    updateAppointment: (state, action) => {
      const idx = state.appointments.findIndex(
        (a) => a.id === action.payload.id
      );
      if (idx !== -1) state.appointments[idx] = action.payload;
    },
    deleteAppointment: (state, action) => {
      state.appointments = state.appointments.filter(
        (a) => a.id !== action.payload
      );
    },
    setEditedId: (state, action) => {
      state.editedId = action.payload;
    },
    clearEditedId: (state) => {
      state.editedId = null;
    },
    setToast: (state, action) => {
      state.toast = action.payload;
    },
    clearToast: (state) => {
      state.toast = null;
    },
    setAppointments: (state, action) => {
      state.appointments = action.payload;
    },
  },
});

export const {
  addAppointment,
  updateAppointment,
  deleteAppointment,
  setEditedId,
  clearEditedId,
  setToast,
  clearToast,
  setAppointments,
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;
