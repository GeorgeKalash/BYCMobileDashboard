import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { RootState } from '../Store';
import { RequestProps } from '@/Types/RequestType';
import { decrementRequests, incrementRequests } from './RequestSlice';

type Method = 'GET' | 'POST';

const makeApiRequest = async (
  method: Method,
  url: string,
  token: string,
  languageId?: number,
  body?: any,
  rawBody: boolean = false
) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data',
    LanguageId: languageId?.toString() || '1',
  };

  if (method === 'GET') {
    return axios.get(url, { headers });
  }

  if (rawBody) {
    headers['Content-Type'] = 'application/json';
    return axios.post(url, JSON.stringify(body), { headers });
  } else {
    const formData = new FormData();
    formData.append('record', JSON.stringify(body));
    return axios.post(url, formData, { headers });
  }
};

export const getAccessToken = createAsyncThunk<string, void, { state: RootState }>(
  'auth/getAccessToken',
  async (_, { dispatch }) => {
    const user = JSON.parse(sessionStorage.getItem('userData') || 'null');
    if (!user?.expiresAt) return user?.accessToken || '';

    const now = Math.floor(Date.now() / 1000);
    if (user.expiresAt > now) return user.accessToken;

    const formData = new FormData();
    formData.append('record', JSON.stringify({
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
    }));

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_AuthURL}MA.asmx/newAT`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const { accessToken, refreshToken } = response.data.record;
    const { exp: expiresAt } = jwtDecode(accessToken) as { exp: number };

    dispatch({
      type: 'auth/updateUser',
      payload: { ...user, accessToken, refreshToken, expiresAt },
    });

    return accessToken;
  }
);

// Helper wrapper to handle loading state
const withLoading = async (dispatch: any, fn: () => Promise<any>, throwError?: boolean) => {
  dispatch(incrementRequests());
  try {
    return await fn();
  } catch (error: any) {
    if (throwError) throw error;
    return error?.response?.data || error.message || 'Unknown error';
  } finally {
    dispatch(decrementRequests());
  }
};

export const getRequest = createAsyncThunk<any, RequestProps, { state: RootState }>(
  'request/getRequest',
  async (body, { getState, dispatch }) => {
    const { user } = getState().authSlice;
    const token = await dispatch(getAccessToken()).unwrap();
    const apiUrl = localStorage.getItem('apiUrl') || '';
    const url = `${apiUrl}${body.extension}${body.parameters ? `?${body.parameters}` : ''}`;

    return await withLoading(dispatch, () =>
      makeApiRequest('GET', url, token, user?.languageId).then(res => res.data),
      body.throwError
    );
  }
);

export const getMobileRequest = createAsyncThunk<any, RequestProps, { state: RootState }>(
  'request/getMobileRequest',
  async (body, { getState, dispatch }) => {
    const { user } = getState().authSlice;
    const token = await dispatch(getAccessToken()).unwrap();
    const url = `https://byc-staging-mobile-api.arguserp.net${body.extension}${body.parameters ? `?${body.parameters}` : ''}`;

    return await withLoading(dispatch, () =>
      makeApiRequest('GET', url, token, user?.languageId).then(res => res.data),
      body.throwError
    );
  }
);

export const postRequest = createAsyncThunk<any, RequestProps & { rawBody?: boolean }, { state: RootState }>(
  'request/postRequest',
  async (body, { getState, dispatch }) => {
    const { user } = getState().authSlice;
    const token = await dispatch(getAccessToken()).unwrap();
    const apiUrl = localStorage.getItem('apiUrl') || '';
    const url = `${apiUrl}${body.extension}${body.parameters ? `?${body.parameters}` : ''}`;

    return await withLoading(dispatch, () =>
      makeApiRequest('POST', url, token, user?.languageId, body.body, body.rawBody).then(res => res.data),
      body.throwError
    );
  }
);

export const postMobileRequest = createAsyncThunk<any, RequestProps & { rawBody?: boolean }, { state: RootState }>(
  'request/postMobileRequest',
  async (body, { getState, dispatch }) => {
    const { user } = getState().authSlice;
    const token = await dispatch(getAccessToken()).unwrap();
    const url = `https://byc-staging-mobile-api.arguserp.net${body.extension}${body.parameters ? `?${body.parameters}` : ''}`;

    return await withLoading(dispatch, () =>
      makeApiRequest('POST', url, token, user?.languageId, body.body, body.rawBody).then(res => res.data),
      body.throwError
    );
  }
);
