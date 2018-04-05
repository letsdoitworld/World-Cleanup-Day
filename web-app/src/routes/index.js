import React from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';

import Root from './Root';

export default () =>
  (<BrowserRouter >
    <div style={{ flex: 1, display: 'flex' }}>
      <Route path="/" component={Root} />
    </div>
  </BrowserRouter>);
