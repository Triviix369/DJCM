import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import { ServerConfiguration } from '../../utils/serverConfig';

// ----------------------------------------------------------------------

const url = ServerConfiguration.LiveServerUrl;

const initialState = {
  isLoading: false,
  error: null,
  users: [],
  openModal: false,
  selectedUserId: null,
  selectedRange: null,
};

const slice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET UserUSERSS
    getUsersSuccess(state, action) {
      state.isLoading = false;
      state.users = action.payload;
    },

    // CREATE USER
    createUserSuccess(state, action) {
      const newUser = action.payload;
      state.isLoading = false;
      state.users = [...state.users, newUser];
    },

    // UPDATE USER
    updateUserSuccess(state, action) {
      state.isLoading = false;
      state.users = state.users.map((user) => {
        if (user.id === action.payload.id) {
          return action.payload;
        }
        return user;
      });
    },

    // DELETE USER
    deleteUserSuccess(state, action) {
      const UserId = action.payload;
      state.users = state.users.filter((user) => user.id !== UserId);
    },

    // SELECT USER
    selectUser(state, action) {
      const UserId = action.payload;
      state.openModal = true;
      state.selectedUserId = UserId;
    },

    // SELECT RANGE
    selectRange(state, action) {
      const { start, end } = action.payload;
      state.openModal = true;
      state.selectedRange = { start, end };
    },

    // OPEN MODAL
    onOpenModal(state) {
      state.openModal = true;
    },

    // CLOSE MODAL
    onCloseModal(state) {
      state.openModal = false;
      state.selectedUserId = null;
      state.selectedRange = null;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { onOpenModal, onCloseModal, selectUser, selectRange } = slice.actions;

// ----------------------------------------------------------------------

export function getUsers(userId, roleId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await fetch(`${url}Employee_ViewEmployeeInfo?LogOnUserID=${userId}&RoleID=${roleId}`);
      const json = await response.json();
      const data = JSON.parse(json);
      console.log(data)
      dispatch(slice.actions.getUsersSuccess(data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createUser(newUser) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/calendar/users/new', newUser);
      dispatch(slice.actions.createUserSuccess(response.data.user));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateUser(UserId, user) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/calendar/users/update', {
        UserId,
        user,
      });
      dispatch(slice.actions.updateUserSuccess(response.data.user));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteUser(UserId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/api/calendar/users/delete', { UserId });
      dispatch(slice.actions.deleteUserSuccess(UserId));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
