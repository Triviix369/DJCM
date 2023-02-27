import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import { ServerConfiguration } from '../../utils/serverConfig';

// ----------------------------------------------------------------------

const url = ServerConfiguration.testingServerUrl;

const initialState = {
  isLoading: false,
  error: null,
  users: [],
  usersDeleted: [],
  userManagement: null,
  roleTypes: [],
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

    // GET PRODUCT
    getProductSuccess(state, action) {
      state.isLoading = false;
      state.userManagement = action.payload;
    },

    // GET USER ROLE TYPES
    getRoleTypeSuccess(state, action) {
      state.isLoading = false;
      state.roleTypes = action.payload;
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
      // const UserId = action.payload;
      // state.users = state.users.filter((user) => user.id !== UserId);
      state.isLoading = false;
      state.usersDeleted = action.payload;
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

export function getLeaveApplication(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/products/product', {
        params: { id },
      });
      dispatch(slice.actions.getProductSuccess(response.data.product));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

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

export function createUser(userId, values, profilePic, profilePicFileType) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    const isHalfDay = values.option !== 0 ? 1 : 0;
    try {
      console.log(`${url}Employee_AddEmployeeInfo?LogOnUserID=${userId}&StaffName=${values.name}&StaffEmail=${values.email}&StaffPhone=${values.phoneNumber}
        &StatusID=${values.statusType}&RecruitmentDate=${values.recruitmentDate}&RoleID=${values.role}&StaffAddress=${values.address}
        &StaffGender=${values.gender} &ICorPassportNo=${values.ICNo}&StaffDateOfBirth=${values.staffDOB}&StaffUsername=${values.username}
        &StaffPassword=${values.userPassword}&ProfilePictureName=${profilePic}&MediaType=${profilePicFileType}`)
      const response = await fetch(
        `${url}Employee_AddEmployeeInfo?LogOnUserID=${userId}&StaffName=${values.name}&StaffEmail=${values.email}&StaffPhone=${values.phoneNumber}
          &StatusID=${values.statusType}&RecruitmentDate=${values.recruitmentDate}&RoleID=${values.role}&StaffAddress=${values.address}
          &StaffGender=${values.gender} &ICorPassportNo=${values.ICNo}&StaffDateOfBirth=${values.staffDOB}&StaffUsername=${values.username}
          &StaffPassword=${values.userPassword}&ProfilePictureName=${profilePic}&MediaType=${profilePicFileType}`
      )
      const json = await response.json();
      const data = JSON.parse(json);
      console.log(data)
      dispatch(slice.actions.createUserSuccess(data));
      // dispatch(slice.actions.resetLeaveSubmitSuccess(data));
      
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

export function getRoleType() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      console.log(`${url}Role_ViewRoleType`)
      const response = await fetch(
        `${url}Role_ViewRoleType`
      )
      const json = await response.json();
      const data = JSON.parse(json);
      console.log('data',data)
      dispatch(slice.actions.getRoleTypeSuccess(data));
      
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteUsers(userId, staffId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      console.log(`${url}Employee_DeleteEmployeeInfo?LogOnUserID=${userId}&StaffID=${staffId}`)
      const response = await fetch(
        `${url}Employee_DeleteEmployeeInfo?LogOnUserID=${userId}&StaffID=${staffId}`
      )
      const json = await response.json();
      const data = JSON.parse(json);
      console.log(data)
      dispatch(slice.actions.deleteUserSuccess(data));
      
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}