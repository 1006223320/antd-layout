import React, { Component } from 'react';
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { Provider as ReduxQueryProvider } from 'redux-query-react'
import './App.css';
import './styles/spectre.styl';

import store, { persistor } from './store'
import {Router} from './routes/router'
class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <ReduxQueryProvider queriesSelector={(state)=>state.queries}>
          <PersistGate loading={null} persistor={persistor}>
            <Router/>
          </PersistGate>
        </ReduxQueryProvider>
      </Provider>
    );
  }

}

export default App;
