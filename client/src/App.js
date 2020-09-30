import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import { useRoutes } from './routes';
import { useAuth } from './hooks/useAuth.hook';
import {AuthContext} from './context/AuthContext';
import {ToastProvider} from 'react-toast-notifications';
import 'bootstrap-css-only/css/bootstrap.min.css'; 
import 'mdbreact/dist/css/mdb.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.scss';

function App() {

  const {login, logout, userId, token} = useAuth();
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated);

  return (
    <>
    <AuthContext.Provider value={{userId, token, login, logout}}>
        <ToastProvider autoDismiss={true}>
          <Router>
            {routes}
          </Router>
        </ToastProvider>
      </AuthContext.Provider>
    </>
  );
}

export default App;
