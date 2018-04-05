import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import { Sidebar } from '../../components/Sidebar';

import {
  actions as userActions,
  selectors as userSels,
} from '../../reducers/user';
import {
  actions as adminActions
} from '../../reducers/admin';

import { UserDetails } from '../../pages/UserDetails';
import { CreateTrashpoint } from '../../components/CreateTrashpoint';
import { AreaList } from '../../pages/AreaList';
import { UserList } from '../../pages/UserList';
import { TeamsList } from '../../pages/TeamsList';
import { AdminMap } from '../../pages/AdminMap';
import { TrashpointDetails } from '../../pages/TrashpointDetails';
import { TeamDetails } from '../../pages/TeamDetails';
import { USER_ROLES } from '../../shared/constants';
import { Terms } from '../../components/Terms';
import { Privacy } from '../../components/Privacy';
import trashpointIcon from '../../assets/trashpoint_menu.png';
import userIcon from '../../assets/user_menu.png';
import teamsIcon from '../../assets/teams_menu.png';

const BOTTOM_LINKS = [
  { title: 'Terms & conditions', url: '/terms' },
  { title: 'Privacy Policy', url: '/privacy' },
];
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
      <Sidebar logoutText="Back" onLogout={this.handleLogout} />
      <Terms onAccept={this.handleTermsAccept} />
    </div>);

  renderTermsRoute = () => <Terms />;
  renderPrivacyRoute = () => <Privacy />;
  renderNormalRoute = ({ history }) =>
    (<div
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
        <Route path="/teams" exact component={TeamsList} />
        {/* <Route path="/areas/:id/trashpoints" exact render={TrashpointList} /> */}
        <Route path="/areas" exact component={AreaList} />
        <Route path="/user-areas" exact component={AreaList} />
        <Route path="/trashpoints/create" exact component={CreateTrashpoint} />
        <Route path="/trashpoints/:id" exact component={TrashpointDetails} />
        <Route path="/teams/:id" exact component={TeamDetails} />
      </Switch>
      <div className="Home-map-container">
        <AdminMap />
      </div>
      <div
        onClick={() => { history.push('/trashpoints/create'); }}
        className="Home-create-marker-button"
      >
        <span>Place trashpoint</span>
      </div>
    </div>);

  render() {
    const { userProfile } = this.props;
    console.log({userProfile})
    if (!userProfile.termsAcceptedAt) {
      return this.renderTerms();
    }
    const SIDEBAR_LINKS = [
      { image: trashpointIcon, title: 'Trashpoints', url: '/areas' },
      { image: teamsIcon, title: 'Teams', url: '/teams' },
    ];
    if ([USER_ROLES.SUPERADMIN, USER_ROLES.LEADER].indexOf(userProfile.role) >= 0) {
      SIDEBAR_LINKS.push({
        image: userIcon,
        title: 'Users',
        url: userProfile.role === USER_ROLES.LEADER ? '/user-areas' : '/users'
      });
    }

    SIDEBAR_LINKS.forEach(link => link.onClick = () => this.props.resetUsers());
    return (
      <div className="Home">
        <Sidebar
          onPrivacyClick={this.handlePrivacyClick}
          onTermsClick={this.handleTermsClick}
          onLogout={this.handleLogout}
          links={SIDEBAR_LINKS}
          bottomLinks={BOTTOM_LINKS}
          authUser={userProfile}
        />
        <Switch>
          <Route path="/terms" render={this.renderTermsRoute} />
          <Route path="/privacy" render={this.renderPrivacyRoute} />
          <Route path="/" render={this.renderNormalRoute} />
        </Switch>
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
  resetUsers: () => dispatch(adminActions.resetUsers())
});

export default connect(mapState, mapDispatchToProps)(Home);
