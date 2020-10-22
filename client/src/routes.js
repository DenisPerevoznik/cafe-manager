import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Analytics } from './pages/dashboard/Analytics';
import { Categories } from './pages/dashboard/Categories';
import { WorkShifts } from './pages/dashboard/WorkShifts/WorkShifts';
import { Companies } from './pages/Companies';
import { Dashboard } from './pages/Dashboard';
import { SignIn } from './pages/SignIn';
import { Signup } from './pages/Signup';
import { WorkShiftSingle } from './pages/dashboard/WorkShifts/WorkShiftSingle';

export const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/companies" exact>
          <Companies />
        </Route>

        <Route path="/analytics" exact>
          <Dashboard component={Analytics} title="Аналитика" />
        </Route>

        <Route path="/categories" exact>
          <Dashboard component={Categories} title="Категории" />
        </Route>

        <Route path="/shifts" exact>
          <Dashboard component={WorkShifts} title="Рабочие смены" />
        </Route>

        <Route path="/shifts/details" exact>
          <Dashboard component={WorkShiftSingle} />
        </Route>

        <Redirect to="/companies" />
      </Switch>
    );
  } else {
    return (
      <Switch>
        <Route path="/" exact>
          <SignIn />
        </Route>

        <Route path="/signup" exact>
          <Signup />
        </Route>

        <Redirect to="/" />
      </Switch>
    );
  }
};
