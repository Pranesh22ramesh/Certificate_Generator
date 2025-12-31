import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { storage } from '../utils/helpers';

// Initial state
const initialState = {
  // Authentication
  isAuthenticated: false,
  user: null,
  userType: null, // 'admin' or 'user'
  token: null,

  // Loading states
  loading: false,
  authLoading: true,

  // UI state
  sidebarOpen: false,

  // Data
  interns: [],
  stats: null,

  // Error handling
  error: null,
};

// Action types
export const actionTypes = {
  // Authentication actions
  AUTH_START: 'AUTH_START',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAILURE: 'AUTH_FAILURE',
  AUTH_LOGOUT: 'AUTH_LOGOUT',
  AUTH_CLEAR_ERROR: 'AUTH_CLEAR_ERROR',

  // Loading actions
  SET_LOADING: 'SET_LOADING',
  SET_AUTH_LOADING: 'SET_AUTH_LOADING',

  // UI actions
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_SIDEBAR: 'SET_SIDEBAR',

  // Data actions
  SET_INTERNS: 'SET_INTERNS',
  ADD_INTERN: 'ADD_INTERN',
  UPDATE_INTERN: 'UPDATE_INTERN',
  DELETE_INTERN: 'DELETE_INTERN',
  SET_STATS: 'SET_STATS',

  // Error actions
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionTypes.AUTH_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        userType: action.payload.userType,
        token: action.payload.token,
        loading: false,
        authLoading: false,
        error: null,
      };

    case actionTypes.AUTH_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        userType: null,
        token: null,
        loading: false,
        authLoading: false,
        error: action.payload,
      };

    case actionTypes.AUTH_LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        userType: null,
        token: null,
        loading: false,
        error: null,
        interns: [],
        stats: null,
      };

    case actionTypes.AUTH_CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case actionTypes.SET_AUTH_LOADING:
      return {
        ...state,
        authLoading: action.payload,
      };

    case actionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };

    case actionTypes.SET_SIDEBAR:
      return {
        ...state,
        sidebarOpen: action.payload,
      };

    case actionTypes.SET_INTERNS:
      return {
        ...state,
        interns: action.payload,
      };

    case actionTypes.ADD_INTERN:
      return {
        ...state,
        interns: [action.payload, ...state.interns],
      };

    case actionTypes.UPDATE_INTERN:
      return {
        ...state,
        interns: state.interns.map(intern =>
          intern._id === action.payload._id ? action.payload : intern
        ),
      };

    case actionTypes.DELETE_INTERN:
      return {
        ...state,
        interns: state.interns.filter(intern => intern._id !== action.payload),
      };

    case actionTypes.SET_STATS:
      return {
        ...state,
        stats: action.payload,
      };

    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = storage.get('token');
        const user = storage.get('user');
        const userType = storage.get('userType');

        if (token && user && userType) {
          dispatch({
            type: actionTypes.AUTH_SUCCESS,
            payload: {
              token,
              user,
              userType,
            },
          });
        } else {
          dispatch({
            type: actionTypes.SET_AUTH_LOADING,
            payload: false,
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch({
          type: actionTypes.SET_AUTH_LOADING,
          payload: false,
        });
      }
    };

    initializeAuth();
  }, []);

  // Action creators
  const actions = {
    // Authentication actions
    authStart: () => {
      dispatch({ type: actionTypes.AUTH_START });
    },

    authSuccess: (userData) => {
      console.log('🔑 AuthSuccess called with:', userData);
      const { token, userType } = userData;
      let user;

      if (userType === 'admin') {
        user = userData.admin;
      } else {
        user = userData.intern;
      }

      console.log('💾 Saving to localStorage:', { token: token?.substring(0, 20) + '...', user, userType });

      // Save to localStorage
      storage.set('token', token);
      storage.set('user', user);
      storage.set('userType', userType);

      console.log('📢 Dispatching AUTH_SUCCESS');
      dispatch({
        type: actionTypes.AUTH_SUCCESS,
        payload: {
          token,
          user,
          userType,
        },
      });
    },

    authFailure: (error) => {
      dispatch({
        type: actionTypes.AUTH_FAILURE,
        payload: error,
      });
    },

    logout: () => {
      // Clear localStorage
      storage.remove('token');
      storage.remove('user');
      storage.remove('userType');

      dispatch({ type: actionTypes.AUTH_LOGOUT });
    },

    clearAuthError: () => {
      dispatch({ type: actionTypes.AUTH_CLEAR_ERROR });
    },

    // Loading actions
    setLoading: (loading) => {
      dispatch({
        type: actionTypes.SET_LOADING,
        payload: loading,
      });
    },

    // UI actions
    toggleSidebar: () => {
      dispatch({ type: actionTypes.TOGGLE_SIDEBAR });
    },

    setSidebar: (open) => {
      dispatch({
        type: actionTypes.SET_SIDEBAR,
        payload: open,
      });
    },

    // Data actions
    setInterns: (interns) => {
      dispatch({
        type: actionTypes.SET_INTERNS,
        payload: interns,
      });
    },

    addIntern: (intern) => {
      dispatch({
        type: actionTypes.ADD_INTERN,
        payload: intern,
      });
    },

    updateIntern: (intern) => {
      dispatch({
        type: actionTypes.UPDATE_INTERN,
        payload: intern,
      });
    },

    deleteIntern: (internId) => {
      dispatch({
        type: actionTypes.DELETE_INTERN,
        payload: internId,
      });
    },

    setStats: (stats) => {
      dispatch({
        type: actionTypes.SET_STATS,
        payload: stats,
      });
    },

    // Error actions
    setError: (error) => {
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: error,
      });
    },

    clearError: () => {
      dispatch({ type: actionTypes.CLEAR_ERROR });
    },
  };

  const value = {
    ...state,
    ...actions,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Selectors (computed values)
export const useAuthSelector = () => {
  const { isAuthenticated, user, userType, token, authLoading } = useAppContext();
  return {
    isAuthenticated,
    user,
    userType,
    token,
    authLoading,
    isAdmin: userType === 'admin',
    isUser: userType === 'user',
  };
};

export const useAuthActions = () => {
  const {
    authStart,
    authSuccess,
    authFailure,
    logout,
    clearAuthError,
    setError,
    clearError
  } = useAppContext();

  return {
    authStart,
    authSuccess,
    authFailure,
    logout,
    clearAuthError,
    setError,
    clearError
  };
};

export const useUISelector = () => {
  const { sidebarOpen, loading, error } = useAppContext();
  return {
    sidebarOpen,
    loading,
    error,
  };
};

export const useDataSelector = () => {
  const { interns, stats } = useAppContext();
  return {
    interns,
    stats,
  };
};

export default AppContext;