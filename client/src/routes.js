import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import { Companies } from './pages/Companies';
import { SignIn } from './pages/SignIn';
import { Signup } from './pages/Signup';

export const useRoutes = (isAuthenticated) => {

    if(isAuthenticated){

        return (
            <Switch>
    
                <Route path='/companies' exact>
                    <Companies/>
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