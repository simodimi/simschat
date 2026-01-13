import { createContext, useContext, useState } from "react";

const StatusContext = createContext();

export const useStatus = () => useContext(StatusContext);

export const StatusProvider = ({ children }) => {
  const [hasUnseenStatus, setHasUnseenStatus] = useState(false);

  return (
    <StatusContext.Provider value={{ hasUnseenStatus, setHasUnseenStatus }}>
      {children}
    </StatusContext.Provider>
  );
};
