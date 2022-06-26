import { User } from '../user.model';
import {
  AuthAction,
  AUTHENTICATE_FAIL,
  LOGIN_START,
  AUTHENTICATE_SUCCESS,
  LOGOUT,
  SIGNUP_START,
} from './auth.actions';

export interface AuthState {
  user: User;
  authError: string;
  loading: boolean;
}

const initialState = {
  user: null,
  authError: null,
  loading: false,
};

export function authReducer(
  state = initialState,
  action: AuthAction
): AuthState {
  switch (action.type) {
    case SIGNUP_START:
    case LOGIN_START:
      return {
        ...state,
        authError: null,
        loading: true,
      };

    case AUTHENTICATE_SUCCESS:
      const { email, userId, idToken, expirationDate } = action.payload;
      const user = new User(email, userId, idToken, expirationDate);
      return { ...state, user, authError: null, loading: false };

    case AUTHENTICATE_FAIL:
      return { ...state, authError: action.payload, loading: false };

    case LOGOUT:
      return {
        ...state,
        user: null,
      };

    default:
      return state;
  }
}
