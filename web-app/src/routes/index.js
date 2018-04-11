import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import ROUTES from '../shared/routes';
import Root from './Root';

export default () =>
  (<BrowserRouter >
    <div style={{ flex: 1, display: 'flex' }}>
      <Route path={ROUTES.ROOT} component={Root} />
    </div>
  </BrowserRouter>);
