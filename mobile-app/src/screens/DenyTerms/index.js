import { connect } from 'react-redux';
import { compose, createSink } from 'recompose';
import { NavigationActions } from 'react-navigation';

import { withNavigationHelpers } from '../../services/Navigation';
import { operations } from '../../reducers/user';

const mapDispatch = {
  logout: operations.logout,
};

export const DenyTerms = compose(connect(undefined, mapDispatch), withNavigationHelpers())(
  createSink((props) => {
    const { navigation, logout } = props;
    logout();
    navigation.dispatch(
      NavigationActions.reset({
        index: 1,
        actions: [
          NavigationActions.navigate({ routeName: 'Login' }),
          NavigationActions.navigate({ routeName: 'PublicHome' }),
        ],
      }),
    );
  }),
);
