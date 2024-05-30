import React from 'react';
import WindowWidthContextProvider from '../components/context/windowWidthContextProvider';

const App = ({ Component, pageProps }) => (
  <React.Fragment>
    <WindowWidthContextProvider>
      <Component {...pageProps} />
    </WindowWidthContextProvider>
  </React.Fragment>
);

export default App;
