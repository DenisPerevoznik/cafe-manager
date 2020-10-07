import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Analytics } from './pages/Analytics';
import { Categories } from './pages/Categories';
import { Companies } from './pages/Companies';
import { Dashboard } from './pages/Dashboard';
import { SignIn } from './pages/SignIn';
import { Signup } from './pages/Signup';

export const useRoutes = (isAuthenticated) => {

    if(isAuthenticated){

        return (
            <Switch>
    
                <Route path='/companies' exact>
                    <Companies/>
                </Route>
                
                <Route path="/analytics" exact>
                    <Dashboard component={Analytics} title="Аналитика"/>
                </Route>

                <Route path="/categories" exact>
                    <Dashboard component={Categories} title="Категории"/>
                </Route>

                <Redirect to='/companies'/>
    
            </Switch>
        );
    }
    else{

        return (
            <Switch>
                <Route path="/" exact>
                    <SignIn/>
                </Route>

                <Route path="/signup" exact>
                    <Signup/>
                </Route>

                <Redirect to="/"/>
            </Switch>
        );
    }
}