import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

import MapView from '../MapView';

class EditLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapReady: false,
    };
  }
  handleMapLoad = map => {
    if (map) {
      this.map = map;
      this.setState({ mapReady: true });
    }
  };
  handleMapClick = ev => {
    const { latLng } = ev;
    const { lat, lng } = latLng;
    if (this.props.onLocationChange) {
      this.props.onLocationChange({
        lat: lat(),
        lng: lng(),
      });
    }
  };
  render() {
    const { visible } = this.props;

    return (
      <Modal
        contentLabel="edit-location"
        shouldCloseOnOverlayClick
        onRequestClose={this.props.onClose}
        isOpen={visible}
      >
        <MapView onClick={this.handleMapClick} location={this.props.location} />
      </Modal>
    );
  }
}
EditLocation.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};
export default EditLocation;
