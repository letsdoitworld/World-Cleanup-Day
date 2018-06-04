import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { BinIcon, EventsIcon } from '../../components/common/Icons';
import ROUTES from '../../shared/routes';

import {
  actions as userActions,
  selectors as userSels,
} from '../../reducers/user';
import {
  actions as adminActions,
} from '../../reducers/admin';

import { UserDetails } from '../../pages/UserDetails';
import { CreateTrashpoint } from '../../components/CreateTrashpoint';
import { AreaList } from '../../pages/AreaList';
import { UserList } from '../../pages/UserList';
import { AdminMap } from '../../pages/AdminMap';
import { EventsList } from '../../pages/EventsList';
import { TrashpointDetails } from '../../pages/TrashpointDetails';
import { USER_ROLES } from '../../shared/constants';
import { Terms } from '../../components/Terms';
import { Privacy } from '../../components/Privacy';

class Home extends React.Component {

  static propTypes = {
    history: PropTypes.shape({
      replace: PropTypes.func,
      push: PropTypes.func,
      location: PropTypes.shape({
        pathname: PropTypes.string,
      }),
    }).isRequired,
    logout: PropTypes.func.isRequired,
    agreeToTerms: PropTypes.func.isRequired,
    userProfile: PropTypes.shape({
      role: PropTypes.string,
    }).isRequired,
    resetUsers: PropTypes.func.isRequired,
  };

  componentWillMount() {
    if (this.props.history.location.pathname === ROUTES.ROOT) {
      this.props.history.replace(ROUTES.TRASHPOINTS_ROOT);
    }
  }

  handleLogout = () => {
    this.props.history.push(ROUTES.TRASHPOINTS_ROOT);
    this.props.logout();
  };

  handleTermsAccept = () => {
    this.props.agreeToTerms();
  };

  isUserAllowedAddingTrashpoints =
  [USER_ROLES.SUPERADMIN, USER_ROLES.LEADER].indexOf(this.props.userProfile.role) >= 0;

  renderTerms = () =>
    (<div className="Home">
      <Terms onAccept={this.handleTermsAccept} onDecline={this.handleLogout} />
    </div>);

  renderNormalRoute = ({ history }) =>
    (<div className="Root-normal-route">
      <Switch>
        <Route path={ROUTES.USER_DETAILS} exact component={UserDetails} />
        <Route path={ROUTES.USERLIST} exact component={UserList} />
        <Route path={ROUTES.AREALIST} exact component={AreaList} />
        <Route
          path={ROUTES.EVENTS}
          render={
            ({ match }) =>
              <EventsList eventId={match.params.id} history={history} />}
        />
        <Route path={ROUTES.AREALIST} exact component={AreaList} />
        <Route
          path={ROUTES.CREATE_TRASHPOINT}
          exact
          component={CreateTrashpoint}
        />
        <Route path={ROUTES.TERMS} render={() => <Terms />} />
        <Route path={ROUTES.PRIVACY} render={() => <Privacy />} />
        <Route
          path={ROUTES.TRASHPOINT_DETAILS}
          render={
            ({ match }) =>
              (<TrashpointDetails
                isUserAllowedAdding={this.isUserAllowedAddingTrashpoints}
                trashpointId={match.params.id}
                history={history}
              />)
          }
        />
      </Switch>
      <div className="Home-map-container">
        <AdminMap isUserLoggedIn={!!this.props.userProfile.role} />
      </div>
    </div>);

  render() {
    const { userProfile } = this.props;
    if (userProfile.role && !userProfile.termsAcceptedAt) {
      return this.renderTerms();
    }
    const HEADER_LINKS = [
      { title: 'Trashpoints', url: '/trashpoints', image: <BinIcon /> },
      { title: 'Events', url: '/event', image: <EventsIcon /> },
    ];
    if ([USER_ROLES.SUPERADMIN, USER_ROLES.LEADER].indexOf(userProfile.role) >= 0) {
      HEADER_LINKS.push({
        title: 'Users',
        url: userProfile.role === USER_ROLES.LEADER ? '/user-areas' : '/users'
      });
    }
    HEADER_LINKS.forEach(link => link.onClick = () => this.props.resetUsers());
    return (
      <div className="Home">
        <Header
          onLogout={this.handleLogout}
          links={HEADER_LINKS}
          authUser={userProfile.role ? userProfile : null}
        />
        <Switch>
          <Route path={ROUTES.ROOT} render={this.renderNormalRoute} />
        </Switch>
        <Footer />
      </div>
    );
  }
}
const mapState = state => ({
  userProfile: userSels.getProfile(state),
  isSuperAdmin: userSels.isSuperAdmin(state),
});
const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(userActions.logout()),
  agreeToTerms: () => dispatch(userActions.agreeToTerms()),
  resetUsers: () => dispatch(adminActions.resetUsers()),
});

export default connect(mapState, mapDispatchToProps)(Home);
