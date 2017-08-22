import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

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
import closeButton from '../../assets/closeButton.png';
import { Loader } from '../../components/Spinner';

import { UserAreas } from './components/UserAreas';
import { AreaAssingList } from './components/AreaAssignList';

class UserDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      assignAreas: false,
    };
  }
  componentWillMount = () => {
    const { getUser, user, match } = this.props;

    getUser({ id: match.params.id });
  };

  componentWillReceiveProps = nextProps => {
    if (!this.props.user && nextProps.user) {
      this.loadUserAreas(nextProps.user);
    }
  };

  loadUserAreas = user => {
    const {
      getUser,
      match,
      userAreas,
      userAreasLoading,
      getUserAreas,
    } = this.props;
    if (user.role !== 'leader') {
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
      <UserAreas onClick={this.handleRemoveAreaClicked} areas={userAreas} />
    );
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
    const { user, authUser, loading, error } = this.props;
    if (this.state.assignAreas) {
      return (
        <AreaAssingList
          userId={user.id}
          onClick={this.handleAreaAssign}
          onClose={this.handleAssignAreasClosed}
        />
      );
    }
    if (loading || !user) {
      return (
        <div className="UserDetails">
          <Loader />
        </div>
      );
    }
    if (error && !user) {
      return (
        <div className="UserDetails">
          <div>
            <span>An error was encountered. Please try refreshing</span>
          </div>
        </div>
      );
    }
    return (
      <div className="UserDetails">
        <button
          className="UserDetails-close-button"
          onClick={this.handleCloseClicked}
        >
          <img src={closeButton} alt="" />
        </button>
        <div style={{ padding: '20px' }}>
          <div className="UserDetails-image-container">
            {user.pictureURL &&
              <img className="UserDetails-image" src={user.pictureURL} />}
            <div className="UserDetails-info-container">
              {user.name &&
                <span className="UserDetails-name">
                  {user.name}
                </span>}
              {user.email &&
                <span className="UserDetails-email">
                  {user.email}
                </span>}
              {user.country &&
                <div className="UserDetails-country-container">
                  <img
                    className="UserDetails-country-image"
                    src={require('./image.png')}
                  />
                  <span className="UserDetails-country">
                    {COUNTRIES_HASH[user.country]}
                  </span>
                </div>}
              {user.role &&
                <span className="UserDetails-role">
                  {this.renderRoleName()}
                </span>}
            </div>
          </div>

          <div className="UserDetails-areas-container">
            {this.renderUserAreasList()}
            {authUser.role === 'superadmin' &&
              user.role !== 'superadmin' &&
              <div className="UserDetails-area-assign-container">
                <span
                  className="UserDetails-area-assign-button"
                  onClick={this.handleAssignAreasClicked}
                >
                  Assign areas
                </span>
              </div>}
          </div>
          <div className="UserDetails-actions-container">
            {user.id !== authUser.id &&
              <span
                onClick={this.handleBlockClicked}
                className={classnames('UserDetails-block-user', {
                  locked: user.locked,
                })}
              >
                {user.locked ? 'Unblock user' : 'Block user'}
              </span>}
          </div>
        </div>
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
