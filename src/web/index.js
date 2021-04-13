import React from 'react';
import ReactDOM from 'react-dom';
import { MobXProviderContext } from 'mobx-react';
import { BrowserRouter as Router } from 'react-router-dom';
import ReactModal from 'react-modal';

import createStore from './store';
import App from './app';
import AuthContext from './contexts/auth';
import authModel from './setup/authModel';
import initFirebase from './setup/firebase';

import 'reset-css';

ReactModal.setAppElement('#app');

const store = createStore();

async function init() {
  initFirebase();

  ReactDOM.render(
    <AuthContext.Provider value={authModel}>
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
