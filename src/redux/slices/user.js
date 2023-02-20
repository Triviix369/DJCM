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

    // GET UserS
    getUsersSuccess(state, action) {
      state.isLoading = false;
      state.Users = action.payload;
    },

    // CREATE User
    createUserSuccess(state, action) {
      const newUser = action.payload;
      state.isLoading = false;
      state.Users = [...state.Users, newUser];
    },

    // UPDATE User
    updateUserSuccess(state, action) {
      state.isLoading = false;
      state.Users = state.Users.map((User) => {
        if (User.id === action.payload.id) {
          return action.payload;
        }
        return User;
      });
    },

    // DELETE User
    deleteUserSuccess(state, action) {
      const UserId = action.payload;
      state.Users = state.Users.filter((User) => User.id !== UserId);
    },

    // SELECT User
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
      const response = await axios.post('/api/calendar/Users/new', newUser);
      dispatch(slice.actions.createUserSuccess(response.data.User));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateUser(UserId, User) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/calendar/Users/update', {
        UserId,
        User,
      });
      dispatch(slice.actions.updateUserSuccess(response.data.User));
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
      await axios.post('/api/calendar/Users/delete', { UserId });
      dispatch(slice.actions.deleteUserSuccess(UserId));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
