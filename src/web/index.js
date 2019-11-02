import React from 'react';
import ReactDOM from 'react-dom';
import { MobXProviderContext } from 'mobx-react';
import { BrowserRouter as Router } from 'react-router-dom';

import createStore from './store';
import App from './app';

import 'reset-css';

const store = createStore();

ReactDOM.render(
  <MobXProviderContext.Provider value={store}>
    <Router>
      <App />
    </Router>
  </MobXProviderContext.Provider>,
  document.getElementById('app'),
);
