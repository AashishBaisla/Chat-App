import { createContext, useState } from "react";

export const PopupContext = createContext();

export const PopupContextProvider = ({ children }) => {
  const [LogOut, setLogOut] = useState(false) ;

  return (
    <PopupContext.Provider 
      value={{ LogOut, setLogOut }}>
      {children}
    </PopupContext.Provider>
  );
};