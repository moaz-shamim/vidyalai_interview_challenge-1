import WindowWidthContext from './windowWidthContext';
import React, { useState, useEffect } from 'react';

const WindowWidthContextProvider = ({ children }) => {
  const [isSmallerDevice, setIsSmallerDevice] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsSmallerDevice(width < 500);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <WindowWidthContext.Provider
      value={{ isSmallerDevice }}
    >
      {children}
    </WindowWidthContext.Provider>
  );
};

export default WindowWidthContextProvider;
