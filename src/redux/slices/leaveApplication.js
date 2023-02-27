import sum from 'lodash/sum';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import { ServerConfiguration } from '../../utils/serverConfig';

// ----------------------------------------------------------------------

const url = ServerConfiguration.testingServerUrl;

const initialState = {
  isLoading: false,
  error: null,
  leaves: [],
  leavesDeleted: [],
  leave: null,
  remaining: null,
  submission: null,
  types: [],
  checkout: {
    activeStep: 0,
    cart: [],
    subtotal: 0,
    total: 0,
    discount: 0,
    shipping: 0,
    billing: null,
    totalItems: 0,
  },
};

const slice = createSlice({
  name: 'leave',
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

    // GET LEAVE
    getLeavesSuccess(state, action) {
      state.isLoading = false;
      state.leaves = action.payload;
    },

    // GET REMAINING LEAVE
    getReaminingLeaveSuccess(state, action) {
      state.isLoading = false;
      state.remaining = action.payload;
    },

    // GET TYPE OF LEAVE
    getTypeofLeaveSuccess(state, action) {
      state.isLoading = false;
      state.types = action.payload;
    },

    // SUBMIT LEAVE
    getLeaveSubmitSuccess(state, action) {
      state.isLoading = false;
      state.submission = action.payload;
    },

    // RESET SUBMIT LEAVE
    resetLeaveSubmitSuccess(state) {
      state.submission = null;
    },

    // DELETE LEAVE(S) SUCCESS
    deleteLeaveSuccess(state, action) {
      state.isLoading = false;
      state.leavesDeleted = action.payload;
    },
    // EDIT LEAVE
    getLeaveEditSuccess(state, action) {
      state.isLoading = false;
      state.submission = action.payload;
    },

    // GET PRODUCT
    getProductSuccess(state, action) {
      state.isLoading = false;
      state.leave = action.payload;
    },

    // CHECKOUT
    getCart(state, action) {
      const cart = action.payload;

      const totalItems = sum(cart.map((product) => product.quantity));
      const subtotal = sum(cart.map((product) => product.price * product.quantity));
      state.checkout.cart = cart;
      state.checkout.discount = state.checkout.discount || 0;
      state.checkout.shipping = state.checkout.shipping || 0;
      state.checkout.billing = state.checkout.billing || null;
      state.checkout.subtotal = subtotal;
      state.checkout.total = subtotal - state.checkout.discount;
      state.checkout.totalItems = totalItems;
    },

    addToCart(state, action) {
      const newProduct = action.payload;
      const isEmptyCart = !state.checkout.cart.length;

      if (isEmptyCart) {
        state.checkout.cart = [...state.checkout.cart, newProduct];
      } else {
        state.checkout.cart = state.checkout.cart.map((product) => {
          const isExisted = product.id === newProduct.id;

          if (isExisted) {
            return {
              ...product,
              colors: uniq([...product.colors, ...newProduct.colors]),
              quantity: product.quantity + 1,
            };
          }

          return product;
        });
      }
      state.checkout.cart = uniqBy([...state.checkout.cart, newProduct], 'id');
      state.checkout.totalItems = sum(state.checkout.cart.map((product) => product.quantity));
    },

    deleteCart(state, action) {
      const updateCart = state.checkout.cart.filter((product) => product.id !== action.payload);

      state.checkout.cart = updateCart;
    },

    resetCart(state) {
      state.checkout.cart = [];
      state.checkout.billing = null;
      state.checkout.activeStep = 0;
      state.checkout.total = 0;
      state.checkout.subtotal = 0;
      state.checkout.discount = 0;
      state.checkout.shipping = 0;
      state.checkout.totalItems = 0;
    },

    backStep(state) {
      state.checkout.activeStep -= 1;
    },

    nextStep(state) {
      state.checkout.activeStep += 1;
    },

    gotoStep(state, action) {
      const step = action.payload;
      state.checkout.activeStep = step;
    },

    increaseQuantity(state, action) {
      const productId = action.payload;

      const updateCart = state.checkout.cart.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            quantity: product.quantity + 1,
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;
    },

    decreaseQuantity(state, action) {
      const productId = action.payload;
      const updateCart = state.checkout.cart.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            quantity: product.quantity - 1,
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;
    },

    createBilling(state, action) {
      state.checkout.billing = action.payload;
    },

    applyDiscount(state, action) {
      const discount = action.payload;
      state.checkout.discount = discount;
      state.checkout.total = state.checkout.subtotal - discount;
    },

    applyShipping(state, action) {
      const shipping = action.payload;
      state.checkout.shipping = shipping;
      state.checkout.total = state.checkout.subtotal - state.checkout.discount + shipping;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  getCart,
  addToCart,
  resetCart,
  gotoStep,
  backStep,
  nextStep,
  deleteCart,
  createBilling,
  applyShipping,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity,
} = slice.actions;

// ----------------------------------------------------------------------

export function getLeaveApplications(userId, roleId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await fetch(
        `${url}Leave_ViewLeaveApplication?LogOnUserID=${userId}&RoleID=${roleId}`
      )
      const json = await response.json();
      const data = JSON.parse(json);
      dispatch(slice.actions.getLeavesSuccess(data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getRemainingLeave(userId, roleId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await fetch(
        `${url}Leave_ViewUserDefaultAnnualLeaves?LogOnUserID=${userId}&RoleID=${roleId}`
      )
      const json = await response.json();
      const data = JSON.parse(json);
      dispatch(slice.actions.getReaminingLeaveSuccess(data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getTypeOfLeave(userId, roleId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await fetch(
        `${url}Leave_ViewUserDefaultAnnualLeaves?LogOnUserID=${userId}&RoleID=${roleId}`
      )
      const json = await response.json();
      const data = JSON.parse(json);
      dispatch(slice.actions.getTypeofLeaveSuccess(data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function submitLeave(userId, values) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    const isHalfDay = values.option !== 0 ? 1 : 0;
    try {
      console.log(`${url}User_CreateLeaveApplication?LogOnUserID=${userId}&LeaveTypeID=${values.type}&LeaveDateFrom=${values.startDate}&LeaveDateTo=${values.endDate}&LeaveReason=${values.reason}&LeaveSupportFilename=-&MediaType=-&IsLeaveHalfDay=${isHalfDay}`)
      const response = await fetch(
        `${url}User_CreateLeaveApplication?LogOnUserID=${userId}&LeaveTypeID=${values.type}&LeaveDateFrom=${values.startDate}&LeaveDateTo=${values.endDate}&LeaveReason=${values.reason}&LeaveSupportFilename=-&MediaType=-&IsLeaveHalfDay=${isHalfDay}`
      )
      const json = await response.json();
      const data = JSON.parse(json);
      console.log(data)
      dispatch(slice.actions.getLeaveSubmitSuccess(data));
      // dispatch(slice.actions.resetLeaveSubmitSuccess(data));

    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function resetSubmitLeave() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(slice.actions.resetLeaveSubmitSuccess());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function editLeave(userId, values) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    const isHalfDay = values.option;
    const delInd = values.fileId && values.filename ? 0 : 1;
    try {
      console.log(`${url}User_UpdateLeaveApplication?LogOnUserID=${userId}&LeaveID=${values.leaveId}&LeaveTypeID=${values.type}&LeaveDateFrom=${values.startDate}&LeaveDateTo=${values.endDate}&LeaveReason=${values.reason}&IsLeaveHalfDay=${isHalfDay}&FileID=${values.fileId}&LeaveSupportFilename=${values.filename}&MediaType=${values.fileType}&DelInd=${delInd}`)
      const response = await fetch(
        `${url}User_UpdateLeaveApplication?LogOnUserID=${userId}&LeaveID=${values.leaveId}&LeaveTypeID=${values.type}&LeaveDateFrom=${values.startDate}&LeaveDateTo=${values.endDate}&LeaveReason=${values.reason}&IsLeaveHalfDay=${isHalfDay}&FileID=${values.fileId}&LeaveSupportFilename=${values.filename}&MediaType=${values.fileType}&DelInd=${delInd}`
      )
      const json = await response.json();
      const data = JSON.parse(json);
      dispatch(slice.actions.getLeaveEditSuccess(data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

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

export function deleteLeaveApplications(userId, leaveId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading())
    try {
      console.log(`${url}Leave_Admin_DeleteLeaveApplication?LogOnUserID=${userId}&LeaveID=${leaveId}`)
      const response = await fetch(
        `${url}Leave_Admin_DeleteLeaveApplication?LogOnUserID=${userId}&LeaveID=${leaveId}`
      )
      const json = await response.json();
      const data = JSON.parse(json);
      console.log(data)
      dispatch(slice.actions.deleteLeaveSuccess(data));

    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}