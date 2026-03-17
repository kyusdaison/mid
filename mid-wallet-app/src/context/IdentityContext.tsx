import React, { createContext, useContext, useState, ReactNode } from 'react';

interface IdentityContextData {
  isZkpVerified: boolean;
  unlockIdentity: () => void;
  lockIdentity: () => void;
}

const IdentityContext = createContext<IdentityContextData>({
  isZkpVerified: false,
  unlockIdentity: () => {},
  lockIdentity: () => {},
});

export const useIdentity = () => useContext(IdentityContext);

export const IdentityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isZkpVerified, setIsZkpVerified] = useState(false);

  const unlockIdentity = () => setIsZkpVerified(true);
  const lockIdentity = () => setIsZkpVerified(false);

  return (
    <IdentityContext.Provider value={{ isZkpVerified, unlockIdentity, lockIdentity }}>
      {children}
    </IdentityContext.Provider>
  );
};
