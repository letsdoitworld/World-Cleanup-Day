import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import querystring from 'query-string';
import _ from 'lodash';

import { actions, selectors } from '../../reducers/trashpile';
import { EditTrashpoint } from '../../components/EditTrashpoint';
import { Details } from '../../components/TrashpointDetails';
import {
  actions as appActions,
  selectors as appSelectors,
} from '../../reducers/app';
import { selectors as userSelectors } from '../../reducers/user';
import { USER_ROLES } from '../../shared/constants';

class TrashDetails extends React.Component {

  static propTypes = {
    setActiveTab: PropTypes.func.isRequired,
    showHeader: PropTypes.bool,
    fetchMarkerDetails: PropTypes.func.isRequired,
    focusMapLocation: PropTypes.func.isRequired,
    toggleDetailsWindow: PropTypes.func.isRequired,
    showShareModal: PropTypes.func.isRequired,
    isUserAllowedAdding: PropTypes.bool.isRequired,
    trashpointId: PropTypes.string,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
        edit: PropTypes.string,
      }),
    }),
    isOpened: PropTypes.bool.isRequired,
    marker: PropTypes.shape({
      id: PropTypes.string,
    }),
    location: PropTypes.shape({
      state: PropTypes.shape({
        selectedArea: PropTypes.shape,
      }),
    }),
    authUser: PropTypes.shape({
      role: PropTypes.string,
    }),
    history: PropTypes.shape({
      location: PropTypes.shape({
        search: PropTypes.string,
      }),
      push: PropTypes.func,
    }).isRequired,
    trashTypes: PropTypes.any.isRequired,
    trashOrigin: PropTypes.any.isRequired,
    isShareModalVisible: PropTypes.bool.isRequired,
    ifEditMode: PropTypes.bool.isRequired,
    mapFocusNeeded: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    trashpointId: '',
    authUser: null,
    marker: null,
    match: null,
    location: null,
    showHeader: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      edit: false,
    };
  }

  componentWillMount() {
    if (this.props.showHeader) {
      this.props.setActiveTab('trashpoints');
    }
    this.props.fetchTrashTypesAndOrigin();
  }

  componentDidMount() {
    const { trashpointId, history, mapFocusNeeded } = this.props;
    if (trashpointId) {
      this.fetchMarkerDetails({
        id: trashpointId,
        mapFocusNeeded,
        // focusMap: !!querystring.parse(history.location.search).focus,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.trashpointId &&
      this.props.trashpointId !== nextProps.trashpointId
    ) {
      this.fetchMarkerDetails({
        id: nextProps.trashpointId,
        mapFocusNeeded: this.props.mapFocusNeeded,
      });
    }
  }
  fetchMarkerDetails = ({ id, mapFocusNeeded }) => {
    this.props.fetchMarkerDetails(id, mapFocusNeeded);
  };
  handleOnCloseDetailsClick = () => {
    const url = '/trashpoints';
    this.props.history.push(url, {
      selectedArea: this.props.authUser.role !== USER_ROLES.VOLUNTEER ?
        (this.props.location.state ?
          this.props.location.state.selectedArea :
          undefined) :
        undefined,
    });
  };

  handleOnCloseEditClick = () => {
    this.setState({ edit: false });
  };

  handleEditTrashpoint = () => {
    this.setState({ edit: true });
  };
  handleEditSuccess = () => {
    this.props.fetchMarkerDetails(this.props.trashpointId);
    this.props.history.push(`/trashpoints/${this.props.trashpointId}`);
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
    if (authUser.role === 'leader') {
      const tpCountry = marker.areas[0];
      if (authUser.areas.indexOf(tpCountry) > -1) {
        return true;
      }
      return false;
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
    const { history, ifEditMode, mapFocusNeeded } = this.props;
    if (ifEditMode) {
      return (
        <EditTrashpoint
          history={history}
          marker={this.props.marker}
          actions={this.actions}
          trashTypes={this.props.trashTypes}
          trashOrigin={this.props.trashOrigin}
        />
      );
    }
    return (
      <Details
        marker={this.props.marker}
        isOpened={this.props.isOpened}
        toggleDetailsWindow={this.props.toggleDetailsWindow}
        trashpointId={this.props.trashpointId}
        isUserAllowedAdding={this.props.isUserAllowedAdding}
        showShareModal={this.props.showShareModal}
        history={this.props.history}
        actions={this.actions}
        canEdit={this.canUserEditTrashPoint()}
        showHeader={this.props.showHeader}
        trashTypes={this.props.trashTypes}
        trashOrigin={this.props.trashOrigin}
        isShareModalVisible={this.props.isShareModalVisible}
      />
    );
  }
}

const mapState = state => ({
  marker: selectors.getMarkerDetails(state),
  authUser: userSelectors.getProfile(state),
  isOpened: selectors.getShowDetailsWindow(state),
  isShareModalVisible: appSelectors.getShowShareModal(state),
  trashTypes: selectors.getTrashTypes(state),
  trashOrigin: selectors.getTrashOrigin(state),
});

const mapDispatch = {
  fetchMarkerDetails: actions.fetchMarkerDetails,
  fetchTrashTypesAndOrigin: actions.fetchTrashTypesAndOrigin,
  focusMapLocation: actions.focusMapLocation,
  setActiveTab: appActions.setActiveTab,
  showShareModal: appActions.showShareModal,
  toggleDetailsWindow: actions.toggleDetailsWindow,
};

export default connect(mapState, mapDispatch)(TrashDetails);
