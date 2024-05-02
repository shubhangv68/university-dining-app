import React, { createContext, useContext, useState } from 'react';
import { useCookies } from 'react-cookie';

const AuthDataContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [cookie, setCookie, removeCookie] = useCookies(['refresh_token_cookie']);

  const logout = () => {
    setLoggedIn(false);
    setUser({});
    removeCookie('refresh_token_cookie', { path: '/' });
    localStorage.removeItem('user_email');
  };

  const contextValue = {
    loggedIn,
    setLoggedIn,
    user,
    setUser,
    cookie,
    setCookie,
    removeCookie,
    logout
  };

  return (
    <AuthDataContext.Provider value={contextValue}>
      {children}
    </AuthDataContext.Provider>
  );
};

export const useAuthData = () => useContext(AuthDataContext);