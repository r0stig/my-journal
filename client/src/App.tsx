import React from 'react';
import logo from './logo.svg';
import { Write } from './pages/write/Write';
import { Entries } from './components/entries';
import { initStore } from './lib/store';

function App() {

  React.useEffect(() => {
    initStore()
  }, [])
  return (
    <>
      {/*<Entries />*/}
      <Write />
    </>
  )
}

export default App;
