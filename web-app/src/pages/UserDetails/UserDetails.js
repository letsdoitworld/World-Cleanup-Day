import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { If, Else } from 'react-if';

import {
  selectors as adminSels,
  actions as adminActs,
} from '../../reducers/admin';
import { selectors as userSels } from '../../reducers/user';
import {
  actions as areaActs,
  selectors as areaSels,
} from '../../reducers/areas';
import { COUNTRIES_HASH } from '../../shared/countries';
import { Loader } from '../../components/Spinner';
import { USER_ROLES } from '../../shared/constants';
import { UserAreas } from './components/UserAreas';
import { EmptyUsersState } from '../../components/List/EmptyState';
import { AreaAssignList } from './components/AreaAssignList';
import {
  HumanIcon,
  EmailIcon,
  CollapseIcon,
  ExpandIcon,
  BackIcon,
  LocationIcon24px,
} from '../../components/common/Icons';

class UserDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      assignAreas: false,
      userDetailsVisible: true,
    };
  }

  componentWillMount = () => {
    const { getUser, user, match } = this.props;
    if (!user || user.id !== match.params.id) {
      getUser({ id: match.params.id });
    } else {
      this.loadUserAreas(user);
    }
  };

  componentWillReceiveProps = nextProps => {
    if (
      (!this.props.user && nextProps.user) ||
      (this.props.user &&
      nextProps.user &&
      this.props.user.id !== nextProps.user.id)
    ) {
      if (
        this.props.authUser.id === nextProps.user.id &&
        this.props.authUser.role === USER_ROLES.SUPERADMIN
      ) {
        return;
      }

      this.loadUserAreas(nextProps.user);
    }
  };

  loadUserAreas = user => {
    const {
      authUser,
      getUser,
      match,
      userAreas,
      userAreasLoading,
      getUserAreas,
    } = this.props;
    if (authUser.role !== 'superadmin' && user.id !== authUser.id) {
      return;
    }
    if ((!userAreas || userAreas.length === 0) && !userAreasLoading) {
      getUserAreas({ userId: user.id });
    }
  };

  handleBlockClicked = () => {
    const { user, setUserLocked } = this.props;
    setUserLocked(user.id, !user.locked);
  };

  handleCloseClicked = () => {
    this.props.history.push('/users');
  };

  handleAreaAssign = area => {
    this.props.assignAreaLeader({
      areaId: area.id,
      userId: this.props.user.id,
    });
  };

  handleRemoveAreaClicked = area => {
    this.props.removeAreaLeader({
      areaId: area.id,
      userId: this.props.user.id,
    });
  };

  handleAssignAreasClosed = () => {
    this.setState({ assignAreas: false });
  };

  handleAssignAreasClicked = () => {
    this.setState({ assignAreas: true });
  };

  renderUserAreasList = () => {
    const {
      userAreas,
      userAreasLoading,
      userAreasError,
      getUserAreas,
    } = this.props;
    if (userAreasLoading && !userAreas) {
      return <Loader />;
    }
    if (userAreasError) {
      return <div>error</div>;
    }
    if (!userAreas || userAreas.length === 0) {
      return null;
    }
    return (
      <UserAreas
        onClick={
          this.props.authUser.role === 'superadmin' &&
          this.handleRemoveAreaClicked
        }
        areas={userAreas}
      />
    );
  };

  canBlockUser = () => {
    const { user, authUser } = this.props;
    if (!user || !authUser) {
      return false;
    }
    if (user.id === authUser.id) {
      return false;
    }
    if (['superadmin', 'leader'].indexOf(authUser.role) === -1) {
      return false;
    }
    if (user.role === 'superadmin') {
      return false;
    }
    return true;
  };

  renderRoleName = () => {
    const { user } = this.props;
    switch (user.role) {
      case 'volunteer':
        return 'Volunteer';
      case 'leader':
        return 'Area Leader';
      case 'superadmin':
        return 'Super admin';
      default:
        return 'Volunteer';
    }
  };

  render() {
    const { user, authUser, loading, error, history } = this.props;
    const { userDetailsVisible } = this.state;
    if (this.state.assignAreas) {
      return (
        <AreaAssignList
          userId={user.id}
          onClick={this.handleAreaAssign}
          onClose={this.handleAssignAreasClosed}
        />
      );
    }
    if (loading || !user) {
      return (
        <div className="UserDetails-container scrollbar-modified">
          <div className="UserDetails-header">
            <div
              className="UserDetails-header-back"
              onClick={() => history.goBack()}
            >
              <BackIcon />
            </div>
            <span className="UserDetails-header-title">User details</span>
            <div
              onClick={() => this.setState(
                { userDetailsVisible: !this.state.userDetailsVisible },
              )}
              className="UserDetails-minimize"
            >
              {
                userDetailsVisible ?
                  <CollapseIcon /> :
                  <ExpandIcon />
              }
            </div>
          </div>
          <div className={
              classnames('UserDetails-plot', { isVisible: userDetailsVisible })
            }
          >
            <Loader />
          </div>
        </div>
      );
    }

    return (
      <div className="UserDetails-container">
        <div className="UserDetails-header">
          <div
            className="UserDetails-header-back"
            onClick={() => history.goBack()}
          >
            <BackIcon />
          </div>
          <span className="UserDetails-header-title">User details</span>
          <div
            onClick={() => this.setState(
              { userDetailsVisible: !this.state.userDetailsVisible },
            )}
            className="UserDetails-minimize"
          >
            {
              userDetailsVisible ?
                <CollapseIcon /> :
                <ExpandIcon />
            }
          </div>
        </div>
        <If condition={!loading}>
          <div className={
              classnames('UserDetails-plot', 'scrollbar-modified', { isVisible: userDetailsVisible })
            }
          >
            <div className="UserDetails-image-container">
              {user.pictureURL && (
                <img className="UserDetails-image" src={user.pictureURL} alt="" />
              )}
              <div className="UserDetails-info-container">
                {user.name && (
                  <span className="UserDetails-name">{user.name}</span>
                )}
                {user.country && (
                  <div className="UserDetails-country-container">
                    <LocationIcon24px />
                    <span className="UserDetails-country">
                      {COUNTRIES_HASH[user.country]}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="UserDetails-areas-container">
              <If condition={!!user.role}>
                <div className="UserDetails-block">
                  <HumanIcon />
                  <span className="UserDetails-block-text">
                    {this.renderRoleName()}
                  </span>
                </div>
              </If>
              <If condition={!!user.email}>
                <div className="UserDetails-block">
                  <EmailIcon />
                  <span className="UserDetails-block-text">{user.email}</span>
                </div>
              </If>
              {this.renderUserAreasList()}
              {authUser.role === 'superadmin' &&
              user.role !== 'superadmin' &&
              !user.locked && (
                <div className="UserDetails-area-assign-container">
                  <span
                    className="UserDetails-area-assign-button"
                    onClick={this.handleAssignAreasClicked}
                  >
                    Assign areas
                  </span>
                </div>
              )}
            </div>
            <div className="UserDetails-actions-container">
              {this.canBlockUser() && (
                <span
                  onClick={this.handleBlockClicked}
                  className={classnames('UserDetails-block-user', {
                    locked: user.locked,
                  })}
                >
                  {user.locked ? 'Unblock user' : 'Block user'}
                </span>
              )}
            </div>
          </div>
          <Else>
            <Loader />
          </Else>
        </If>
      </div>
    );
  }
}

const mapState = (state, props) => {
  const { match } = props;
  return {
    user: adminSels.getUser(state),
    loading: adminSels.getUserLoading(state),
    error: adminSels.getUserError(state),
    authUser: userSels.getProfile(state),
    userAreas: areaSels.getUserAreas(state, match.params.id),
    userAreasLoading: areaSels.areUserAreasLoading(state, match.params.id),
    userAreasError: areaSels.hasUserAreaError(state, match.params.id),
  };
};
const mapDispatch = {
  getUser: adminActs.fetchUser,
  setUserLocked: adminActs.setUserLocked,
  getUserAreas: areaActs.getUserAreas,
  assignAreaLeader: areaActs.assignAreaLeader,
  removeAreaLeader: areaActs.removeAreaLeader,
};

export default connect(mapState, mapDispatch)(UserDetails);
