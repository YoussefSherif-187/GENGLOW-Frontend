// src/auth/AuthReducer.js

export const initialState = {
  user: null,
  loading: true,
  error: null,
};

export const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
      };

    case "LOGIN_ERROR":
      return {
        ...state,
        user: null,
        loading: false,
        error: action.payload,
      };

    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        loading: false,
        error: null,
      };

    case "LOADING":
      return {
        ...state,
        loading: true,
      };

    default:
      return state;
  }
};
