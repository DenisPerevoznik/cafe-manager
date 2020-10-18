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
import { clearError, clearMessage } from './redux/actions';
import { LoaderPanel } from './components/LoaderPanel';

function App() {

  const {login, logout, userId, token} = useAuth();
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated);
  const error = useSelector(state => state.main.error);
  const message = useSelector(state => state.main.message);
  const loader = useSelector(state => state.main.loader);
  const {addToast} = useToasts();
  const dispatch = useDispatch();

  useEffect(() => {

    if(isAuthenticated){
      axios.get('/api/auth/check', {headers: {Authorization: `Bearer ${token}`}})
      .catch(() => {
        logout();
      })
    }
  }, []);

  useEffect(() => {

    if(Object.keys(error).length){
      if(error.status === 401){
        logout();
      }
      addToast(error.message, {appearance: "error"});
      dispatch(clearError());
    }
  }, [error]);

  useEffect(() => {

    if(Object.keys(message).length){
      addToast(message.text, {appearance: message.type});
      dispatch(clearMessage());
    }
  }, [message]);

  return (
    <>
    {loader && <LoaderPanel />}
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
