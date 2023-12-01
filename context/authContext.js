import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [isVendor, setIsVendor] = useState(false); // Default value
  const [id, setId] = useState(-1);

  const signIn = (newToken, newEmail, newIsVendor, newId) => {
    setToken(newToken);
    setEmail(newEmail);
    setIsVendor(newIsVendor);
    setId(newId);
  };

  const signOut = () => {
    setToken(null);
    setEmail(null);
    setIsVendor(false);
  };

  

  return (
    <AuthContext.Provider value={{ token, email, isVendor, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
