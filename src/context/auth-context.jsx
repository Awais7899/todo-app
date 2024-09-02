import * as React from 'react';
export const AuthContext = React.createContext();


export const AuthContextProvider = ({children}) => {
  const [userData, setUserData] = React.useState({});
  return (
    <AuthContext.Provider
      value={{
        userData,
        setUserData
      }}>
      {children}
    </AuthContext.Provider>
  );
};

