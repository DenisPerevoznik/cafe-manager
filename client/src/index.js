import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore } from 'redux';
import { rootReducer } from './redux/rootReducer';
import {Provider} from 'react-redux';
import {ToastProvider} from 'react-toast-notifications';
import thunk from 'redux-thunk';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';

const store = createStore(rootReducer, ['Use Redux'], applyMiddleware(thunk));
const app = (
  <Provider store={store}>
    <ToastProvider autoDismiss={true}>
      <App/>
    </ToastProvider>
  </Provider>
);

ReactDOM.render(
  <React.StrictMode>
    {app}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
