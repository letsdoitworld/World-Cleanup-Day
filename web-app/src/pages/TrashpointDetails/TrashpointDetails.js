import React from 'react';
import { connect } from 'react-redux';
import querystring from 'query-string';

import { actions, selectors } from '../../reducers/trashpile';
import { EditTrashpoint } from '../../components/EditTrashpoint';
import { Details } from '../../components/Details';

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
    this.props.history.push('/');
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
  render() {
    if (this.state.edit) {
      return (
        <EditTrashpoint marker={this.props.marker} actions={this.actions} />
      );
    }
    return (
      <Details marker={this.props.marker} actions={this.actions} canEdit />
    );
  }
}

const mapState = state => ({
  marker: selectors.getMarkerDetails(state),
});
const mapDispatch = {
  fetchMarkerDetails: actions.fetchMarkerDetails,
  focusMapLocation: actions.focusMapLocation,
};

export default connect(mapState, mapDispatch)(TrashDetails);
