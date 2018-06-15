import React from 'react';
import { connect } from 'react-redux';
import querystring from 'query-string';
import _ from 'lodash';

import { actions, selectors } from '../../reducers/trashpile';
import { EditTrashpoint } from '../../components/EditTrashpoint';
import { Details } from '../../components/Details';
import { selectors as userSelectors } from '../../reducers/user';
import { USER_ROLES } from '../../shared/constants';

class TrashDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
    };
  }

  componentDidMount() {
    const { match, history } = this.props;
    this.fetchMarkerDetails({
      id: match.params.id,
      focusMap: !!querystring.parse(history.location.search).focus,
    });
  }

  componentWillReceiveProps = nextProps => {
    if (this.props.match.params !== nextProps.match.params) {
      this.fetchMarkerDetails({
        id: nextProps.match.params.id,
        focusMap: !!querystring.parse(nextProps.history.location.search).focus,
      });
    }
  };
  fetchMarkerDetails = ({ id, focusMap = false }) => {
    this.props.fetchMarkerDetails(id).then(marker => {
      if (!marker) {
        return;
      }
      if (focusMap) {
        this.props.focusMapLocation(marker.location);
      }
    });
  };
  handleOnCloseDetailsClick = () => {
    let url =  '/';
    if(this.props.location.state && this.props.location.state.selectedArea) {
      url = `${url}areas`;
    }
    if(this.props.location.state && this.props.location.state.selectedTeamId) {
      url = `${url}teams/${this.props.location.state.selectedTeamId}`;
    }
    this.props.history.push(url, {
      selectedArea: this.props.authUser.role !== USER_ROLES.VOLUNTEER ?
        (this.props.location.state ? this.props.location.state.selectedArea : undefined) :
        undefined
    });
  };

  handleOnCloseEditClick = () => {
    this.setState({ edit: false });
  };

  handleEditTrashpoint = () => {
    this.setState({ edit: true });
  };
  handleEditSuccess = () => {
    this.setState({
      edit: false,
    });
    this.props.fetchMarkerDetails(this.props.match.params.id);
  };
  actions = {
    onCloseDetailsClick: this.handleOnCloseDetailsClick,
    onCloseEditClick: this.handleOnCloseEditClick,
    onEditTrashpointClick: this.handleEditTrashpoint,
    onTrashpointEditSuccess: this.handleEditSuccess,
  };
  canUserEditTrashPoint = () => {
    const { authUser, marker } = this.props;
    if (!authUser) {
      return false;
    }
    if (!marker || !marker.id) {
      return false;
    }
    if (authUser.role === 'superadmin') {
      return true;
    }
    if (!Array.isArray(authUser.areas)) {
      return false;
    }
    if (authUser.areas.length === 0) {
      return false;
    }
    if (!Array.isArray(marker.areas)) {
      return false;
    }
    return _.intersection(authUser.areas, marker.areas).length > 0;
  };

  render() {
    const { history } = this.props;
    if (this.state.edit) {
      return (
        <EditTrashpoint
          history={history}
          marker={this.props.marker}
          actions={this.actions}
        />
      );
    }
    return (
      <Details
        marker={this.props.marker}
        actions={this.actions}
        canEdit={this.canUserEditTrashPoint()}
      />
    );
  }
}

const mapState = state => ({
  marker: selectors.getMarkerDetails(state),
  authUser: userSelectors.getProfile(state),
});
const mapDispatch = {
  fetchMarkerDetails: actions.fetchMarkerDetails,
  focusMapLocation: actions.focusMapLocation,
};

export default connect(mapState, mapDispatch)(TrashDetails);
