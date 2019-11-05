import React from 'react';
import ReactDOM from 'react-dom';
import { MobXProviderContext } from 'mobx-react';
import { BrowserRouter as Router } from 'react-router-dom';

import createStore from './store';
import App from './app';
import AuthContext from './contexts/auth';
import AuthModel from './store/models/auth';

import 'reset-css';

const store = createStore();
const authStore = new AuthModel();

async function init() {
  await authStore.reauthenticateFromStorage();

  ReactDOM.render(
    <AuthContext.Provider value={authStore}>
      <MobXProviderContext.Provider value={store}>
        <Router>
          <App />
        </Router>
      </MobXProviderContext.Provider>
    </AuthContext.Provider>,
    document.getElementById('app'),
  );
}

init();
