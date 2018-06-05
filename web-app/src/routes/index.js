import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import ROUTES from '../shared/routes';
import Root from './Root';

export default () =>
  (<BrowserRouter >
    <div className="Root-component">
      <Route path={ROUTES.ROOT} component={Root} />
    </div>
  </BrowserRouter>);
