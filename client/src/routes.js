import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import { SignIn } from './pages/SignIn';

export const useRoutes = () => {

    return (
        <Switch>

            <Route path='/' exact>
                <SignIn/>
            </Route>

        </Switch>
    );
}