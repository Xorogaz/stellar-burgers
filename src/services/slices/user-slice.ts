import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '@api';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../../utils/constants';

export type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isUserRequest: boolean;
  userError: string | null;
};

export const userInitialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isUserRequest: false,
  userError: null
};

const saveTokens = (accessToken: string, refreshToken: string) => {
  setCookie(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

const removeTokens = () => {
  deleteCookie(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    saveTokens(response.accessToken, response.refreshToken);
    return response.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    saveTokens(response.accessToken, response.refreshToken);
    return response.user;
  }
);

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi();
  removeTokens();
});

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_arg: void, { dispatch }) => {
    if (!getCookie(ACCESS_TOKEN_KEY)) return;
    await dispatch(getUser());
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {
    clearUserError: (state) => {
      state.userError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isUserRequest = true;
        state.userError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isUserRequest = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isUserRequest = false;
        state.userError = action.error.message ?? null;
      })
      .addCase(loginUser.pending, (state) => {
        state.isUserRequest = true;
        state.userError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isUserRequest = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isUserRequest = false;
        state.userError = action.error.message ?? null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state) => {
        state.user = null;
      })
      .addCase(updateUser.pending, (state) => {
        state.isUserRequest = true;
        state.userError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isUserRequest = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isUserRequest = false;
        state.userError = action.error.message ?? null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(checkUserAuth.fulfilled, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthChecked = true;
      });
  }
});

export const { clearUserError } = userSlice.actions;

export const userReducer = userSlice.reducer;
export default userSlice;
