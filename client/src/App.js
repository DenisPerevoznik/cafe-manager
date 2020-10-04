import React, { useEffect } from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import { useRoutes } from './routes';
import { useAuth } from './hooks/useAuth.hook';
import {AuthContext} from './context/AuthContext';
import {useToasts} from 'react-toast-notifications';
import { Header } from './components/Header';
import { useDispatch, useSelector } from 'react-redux';
import 'bootstrap-css-only/css/bootstrap.min.css'; 
import 'mdbreact/dist/css/mdb.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.scss';
import axios from 'axios';
import { clearError } from './redux/actions';

function App() {

  const {login, logout, userId, token} = useAuth();
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated);
  const error = useSelector(state => state.main.error);
  const {addToast} = useToasts();
  const dispatch = useDispatch();

  useEffect(() => {

    if(isAuthenticated){
      axios.get('/api/auth/check', {headers: {Authorization: `Bearer ${token}`}})
      .catch(() => {
        logout();
      })
    }
  }, [isAuthenticated]);

  useEffect(() => {

    if(Object.keys(error).length){
      if(error.status === 401){
        logout();
      }
      addToast(error.message, {appearance: "error"});
      dispatch(clearError());
    }
  }, [error]);

  return (
    <>
    <AuthContext.Provider value={{userId, token, login, logout}}>
        <Router>
          {isAuthenticated && 
            <div className="container-fluid">
              <div className="row">
                <Header/>
              </div>
            </div>
          }
          {routes}
        </Router>
      </AuthContext.Provider>
    </>
  );
}

export default App;
