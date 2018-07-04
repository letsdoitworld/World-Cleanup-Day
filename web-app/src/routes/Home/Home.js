import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import {
  BinIcon,
  EventsIcon,
  UsersIcon,
  TeamsIcon,
} from '../../components/common/Icons';
import ROUTES from '../../shared/routes';

import {
  actions as userActions,
  selectors as userSels,
} from '../../reducers/user';
import {
  actions as appActions,
} from '../../reducers/app';
import {
  actions as adminActions,
} from '../../reducers/admin';

import { UserDetails } from '../../pages/UserDetails';
import { CreateTrashpoint } from '../../components/CreateTrashpoint';
import { AreaList } from '../../pages/AreaList';
import { UserList } from '../../pages/UserList';
import CountriesList from '../../pages/CountriesList/CountriesList';
import { AdminMap } from '../../pages/AdminMap';
import { EventsRoot } from '../../pages/EventsRoot';
import { TeamsList } from '../../pages/TeamsList';
import { TeamDetails } from '../../pages/TeamDetails';
import EventsList from '../../pages/EventsRoot/EventsList';
import EventDetails from '../../pages/EventsRoot/EventDetails';
import EventTrashpointList from '../../pages/EventsRoot/EventTrashpointList';
import { TrashpointDetails } from '../../pages/TrashpointDetails';
import { USER_ROLES } from '../../shared/constants';
import { Terms } from '../../components/Terms';
import { Privacy } from '../../components/Privacy';
import { AppLinksModal } from '../../components/AppLinksModal';

class Home extends React.Component {

  static propTypes = {
    history: PropTypes.shape({
      replace: PropTypes.func,
      push: PropTypes.func,
      location: PropTypes.shape({
        pathname: PropTypes.string,
      }),
      listen: PropTypes.func,
    }).isRequired,
    logout: PropTypes.func.isRequired,
    agreeToTerms: PropTypes.func.isRequired,
    userProfile: PropTypes.shape({
      role: PropTypes.string,
    }).isRequired,
    resetUsers: PropTypes.func.isRequired,
    updateRouterInfo: PropTypes.func.isRequired,
  };

  componentWillMount() {
    if (this.props.history.location.pathname === ROUTES.ROOT) {
      this.props.history.replace(ROUTES.TRASHPOINTS_ROOT);
    }
    this.props.history.listen((location, action) => {
      this.props.updateRouterInfo({ ...location, action });
    });
  }

  handleLogout = () => {
    this.props.history.push(ROUTES.TRASHPOINTS_ROOT);
    this.props.logout();
  };

  handleTermsAccept = () => {
    this.props.agreeToTerms();
  };

  renderTerms = () =>
    (<div className="Home">
      <Terms
        onAccept={this.handleTermsAccept}
        onDecline={this.handleLogout}
      />
      <div className="Home-map-container">
        <Header
          onLogout={this.handleLogout}
          links={null}
          authUser={null}
        />
        <AdminMap isUserLoggedIn={false} />
        <Footer />
      </div>
    </div>);

  renderNormalRoute = ({ history }) =>
    (<div className="Root-normal-route">
      <Switch>
        <Route path={ROUTES.USER_DETAILS} exact component={UserDetails} />
        <Route path={ROUTES.COUNTRIES_LIST} exact component={CountriesList} />
        <Route path={ROUTES.USERLIST} exact component={UserList} />
        <Route path={ROUTES.AREALIST} exact component={AreaList} />
        <Route path={ROUTES.TEAMS_LIST} exact component={TeamsList} />
        <Route path={ROUTES.TEAM_DETAILS} exact component={TeamDetails} />
        <Route path={ROUTES.EVENTS_LIST}>
          <EventsRoot history={history}>
            <Route
              path={ROUTES.EVENTS_LIST}
              exact
              component={EventsList}
            />
            <Route
              path={ROUTES.EVENT_DETAILS}
              exact
              render={
                ({ match }) => {
                  return (
                    <EventDetails eventId={match.params.eventId} />
                  );
                }}
            />
            <Route
              path={ROUTES.EVENT_TRASHPOINTS}
              exact
              render={
                ({ match }) => {
                  return (
                    <EventTrashpointList targetId={match.params.eventId} />
                  );
                }}
            />
            <Route
              path={ROUTES.EVENT_TRASHPOINT_DETAILS}
              exact
              render={
                ({ match }) => {
                  return (
                    <TrashpointDetails
                      trashpointId={match.params.trashpointId}
                    />
                  );
                }}
            />
          </EventsRoot>
        </Route>
        <Route path={ROUTES.AREALIST} exact component={AreaList} />
        <Route
          path={ROUTES.CREATE_TRASHPOINT}
          exact
          component={CreateTrashpoint}
        />
        <Route path={ROUTES.TERMS} render={() => <Terms />} />
        <Route path={ROUTES.PRIVACY} render={() => <Privacy />} />
        <Route
          path={ROUTES.TRY_OUR_APP}
          component={AppLinksModal}
        />
        <Route
          path={ROUTES.TRASHPOINT_DETAILS}
          render={
            ({ match }) =>
              (<TrashpointDetails
                showHeader
                isUserAllowedAdding={
                  [
                    USER_ROLES.SUPERADMIN,
                    USER_ROLES.LEADER,
                  ].indexOf(this.props.userProfile.role) >= 0
                }
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
      HEADER_LINKS.push(
        {
          title: 'Teams',
          url: '/teams',
          image: <TeamsIcon />,
        },
        {
          title: 'Users',
          url: userProfile.role === USER_ROLES.LEADER
          ? '/user-areas'
          : '/countries',
          image: <UsersIcon />,
        },
      );
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
  updateRouterInfo: (router) => dispatch(appActions.updateRouterInfo(router)),
});

export default connect(mapState, mapDispatchToProps)(Home);
