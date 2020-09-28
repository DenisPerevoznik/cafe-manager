import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import { useRoutes } from './routes';
import 'bootstrap-css-only/css/bootstrap.min.css'; 
import 'mdbreact/dist/css/mdb.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.scss';

function App() {

  const routes = useRoutes();

  return (
    <>
      <Router>
        {routes}
      </Router>
    </>
  );
}

export default App;
