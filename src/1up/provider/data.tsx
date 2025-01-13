/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import Store from '../utils/store';
import {authenticatedGet, authenticatedPost, AuthStatus} from '../utils/api';
import {useNavigation} from '@react-navigation/native';
import {GlobalNavigationProp} from '../../../App';
import {ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY} from '../constants';
import {Alert} from 'react-native';
import {AxiosResponse, HttpStatusCode} from 'axios';
import {UserData} from './types';
import Toast from 'react-native-toast-message';
import {Strategy} from '../../app/types/types';

const store = new Store();

interface DataContextProps {
  user: UserData | null;
  setAuthStatus: (status: AuthStatus) => void;
  authStatus: AuthStatus;
  logout: () => void;
  getUser: () => void;
  holdings: Strategy[];
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

const useDataHook = () => {
  const sessionTimer = useRef<NodeJS.Timeout | null>(null);
  const navigation = useNavigation<GlobalNavigationProp>();
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.Unknown);
  const [user, setUser] = useState<UserData | null>(null);
  const [holdings, setHoldings] = useState<Strategy[]>([]);

  // Initial token check
  useEffect(() => {
    const checkToken = async () => {
      const token = await store.get(ACCESS_TOKEN_KEY);
      setAuthStatus(
        token ? AuthStatus.ValidateAccess : AuthStatus.AuthRequired,
      );
    };
    checkToken();
  }, []);

  // Effect to handle auth state changes
  useEffect(() => {
    if (authStatus === AuthStatus.AuthRequired) {
      handleUnauthenticated();
    } else if (authStatus === AuthStatus.ValidateAccess) {
      // store.remove(ACCESS_TOKEN_KEY);
      getUser();
    } else if (authStatus === AuthStatus.AuthSuccessful) {
      navigation.reset({index: 0, routes: [{name: 'HomeTabs'}]});
    }
  }, [authStatus]);

  useEffect(() => {
    if (user) {
      handleHoldingNumbers();
    }
  }, [user]);

  // Handle logout and clear session
  const logout = async () => {
    try {
      await authenticatedGet('webV1/auth/logout');
      handleUnauthenticated();
    } catch (error) {
      console.error('Logout failed', error);
      Alert.alert('Error logging out');
    }
  };

  // Fetch user information
  const getUser = async () => {
    try {
      const res = await authenticatedGet('/webV1/auth/isloggedIn/check');
      if (res.status === HttpStatusCode.Ok) {
        setUser(res.data);
        setAuthStatus(AuthStatus.AuthSuccessful);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      handleUnauthenticated();
    }
  };

  // Clear token and set auth status to AuthRequired
  const handleUnauthenticated = () => {
    store.remove(ACCESS_TOKEN_KEY);
    store.remove(REFRESH_TOKEN_KEY);
    setUser(null);
    setAuthStatus(AuthStatus.AuthRequired);
    navigation.reset({index: 0, routes: [{name: 'Signin'}]});
    if (sessionTimer.current) {
      clearTimeout(sessionTimer.current);
    }
  };

  // numnber of holdings by user
  const handleHoldingNumbers = async () => {
    try {
      const res: AxiosResponse<any> = await authenticatedGet(
        '/webV1/pages/dashboard/getAllStrategies',
      );
      if (res.data) {
        setHoldings(res.data);
      }
    } catch (error) {
      Toast.show({
        type: 'errorToast',
        text1: 'Error while fetching the portfolio holdings',
      });
    }
  };

  // Schedule token refresh with 1-day expiry
  const scheduleRefresh = () => {
    const oneDayInMilliseconds = 86400 * 1000; // 1 day

    if (sessionTimer.current) {
      clearTimeout(sessionTimer.current);
    }
    sessionTimer.current = setTimeout(refreshSession, oneDayInMilliseconds);
  };

  // Refresh session and update access token
  const refreshSession = async () => {
    const token = await store.get(REFRESH_TOKEN_KEY);
    try {
      const res: AxiosResponse<any> = await authenticatedPost(
        '/webV1/auth/default/refresh-token',
        {
          refreshToken: token,
        },
      );
      if (res.data.accessToken) {
        await store.save(ACCESS_TOKEN_KEY, res.data.accessToken);
        scheduleRefresh();
        if (!user) {
          setAuthStatus(AuthStatus.ValidateAccess);
        }
      } else {
        handleUnauthenticated();
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      handleUnauthenticated();
    }
  };

  return React.useMemo(
    () => ({
      user,
      setAuthStatus,
      authStatus,
      logout,
      getUser,
      holdings,
    }),
    [user, authStatus],
  );
};

interface Props {
  children: ReactNode;
}

export const DataContextProvider: React.FC<Props> = ({children}) => {
  const data = useDataHook();
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextProps => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataContextProvider');
  }
  return context;
};
