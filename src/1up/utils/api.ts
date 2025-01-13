import axios, {AxiosHeaders, AxiosResponse, HttpStatusCode} from 'axios';
import Store from './store';
import {ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY} from '../constants';
// import Config from 'react-native-config';
// const BASE_URL = 'http://localhost:5000';
// const BASE_URL = 'http://3.143.18.32/api';
// const BASE_URL = 'http://18.219.245.62/api';
const BASE_URL = 'https://app.oneupinvest.com/api';

const store = new Store();

async function getAxiosInstance(
  useAuth?: boolean,
  headers?: typeof AxiosHeaders,
) {
  const systemHeaders = new AxiosHeaders({
    'Content-Type': 'application/json',
  });

  if (useAuth) {
    const accessToken = await store.get(ACCESS_TOKEN_KEY);
    if (accessToken) {
      systemHeaders.set('Authorization', `Bearer ${accessToken}`);
    }
  }

  const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
      ...headers,
      ...systemHeaders,
    },
  });

  instance.interceptors.response.use(responseInterceptor);
  return instance;
}

const responseInterceptor = async (res: AxiosResponse) => {
  if (res.data.accessToken) {
    await store.save(ACCESS_TOKEN_KEY, res.data.accessToken);
  }

  if (res.data.refreshToken) {
    await store.save(REFRESH_TOKEN_KEY, res.data.refreshToken);
  }

  if (res.status === HttpStatusCode.Unauthorized) {
    await store.remove(ACCESS_TOKEN_KEY);
    await store.remove(REFRESH_TOKEN_KEY);
  }

  return res;
};

export const get = async (path: string, headers?: any) => {
  const axiosInstance = await getAxiosInstance(false, headers);
  return axiosInstance.get(path);
};

export async function post(
  path: string,
  payload?: any,
  headers?: any,
): Promise<AxiosResponse<any>> {
  const axiosInstance = await getAxiosInstance(false, headers);
  return axiosInstance.post(path, payload);
}

export const authenticatedPost = async (
  path: string,
  payload?: any,
  headers?: any,
): Promise<AxiosResponse<any>> => {
  const axiosInstance = await getAxiosInstance(true, headers);
  return axiosInstance.post(path, payload);
};

export const authenticatedGet = async (
  path: string,
  params?: any,
  headers?: any,
): Promise<AxiosResponse<any>> => {
  const axiosInstance = await getAxiosInstance(true, headers);
  return axiosInstance.get(path, {
    params: params,
  });
};

export const authenticatedDelete = async (
  path: string,
  params?: any,
  headers?: any,
): Promise<AxiosResponse<any>> => {
  const axiosInstance = await getAxiosInstance(true, headers);
  return axiosInstance.delete(path, params);
};

export const authenticatedPut = async (
  path: string,
  payload?: any,
): Promise<AxiosResponse<any>> => {
  const axiosInstance = await getAxiosInstance(true);
  return axiosInstance.put(path, payload);
};

export enum AuthStatus {
  Unknown,
  AuthRequired,
  ValidateAccess,
  AuthSuccessful,
}
