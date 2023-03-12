import { createContext, useReducer } from "react";
import { useCookies } from "react-cookie";

export const UserContext = createContext();

const initialState = {
  isLogin: false,
  user: {},
};

export const USER_ACTION_TYPE = {
  USER_SUCCESS: "USER_SUCCESS",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  AUTH_ERROR: "AUTH_ERROR",
  LOGOUT: "LOGOUT",
};

export const UserContextProvider = ({ children }) => {
  const reducer = (state, action) => {
    const { type, payload } = action;

    switch (type) {
      case USER_ACTION_TYPE.USER_SUCCESS:
      case USER_ACTION_TYPE.LOGIN_SUCCESS:
        console.log(payload.photo)
        setCookies("token", payload.token, { path: "/" });
        return {
          isLogin: true,
          user: payload,
        };

      case USER_ACTION_TYPE.AUTH_ERROR:
      case USER_ACTION_TYPE.LOGOUT:
        removeCookies("token", { path: "/" });
        return initialState;
      default:
        break;
    }
  };
  
  const [_, setCookies, removeCookies] = useCookies();
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={[state, dispatch]}>
      {children}
    </UserContext.Provider>
  );
};
