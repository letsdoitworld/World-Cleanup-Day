import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { BinIcon, EventsIcon } from '../../components/common/Icons';

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
  handleLogout = () => {
    this.props.history.push('/');
    this.props.logout();
  };

  handleTermsAccept = () => {
    this.props.agreeToTerms();
  };

  renderTerms = () =>
    (<div className="Home">
      <Header
        onLogout={this.handleLogout}
      />
      <Terms onAccept={this.handleTermsAccept} />
    </div>);

  renderTermsRoute = () => <Terms />;
  renderPrivacyRoute = () => <Privacy />;
  renderNormalRoute = ({ history }) =>
    (<div
      className="Root-normal-route"
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Switch>
        <Route path="/users/:id" exact component={UserDetails} />
        <Route path="/users" exact component={UserList} />
        <Route path="/areas" exact component={AreaList} />
        <Route
          path="/events/:id?"
          render={
            ({ match }) =>
              <EventsList eventId={match.params.id} history={history} />}
        />
        <Route path="/user-areas" exact component={AreaList} />
        <Route path="/trashpoints/create" exact component={CreateTrashpoint} />
        <Route
          path="/trashpoints/:id?"
          render={
            ({ match }) =>
              <TrashpointDetails
                isUserLoggedIn={!!this.props.userProfile.role}
                trashpointId={match.params.id}
                history={history}
              />
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
      { title: 'Events', url: '/events', image: <EventsIcon /> },
      { title: 'Trashpoints', url: '/trashpoints', image: <BinIcon /> }
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
          <Route path="/terms" render={this.renderTermsRoute} />
          <Route path="/privacy" render={this.renderPrivacyRoute} />
          <Route path="/" render={this.renderNormalRoute} />
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

/*
<Route
  path="/trashpoints"
  render={
    () => {
      return (
        <div
          onClick={() => { history.push('/trashpoints/create'); }}
          className="Home-create-marker-button"
        >
          <span>Place trashpoint</span>
        </div>
      );
    }
  }
/>
*/
