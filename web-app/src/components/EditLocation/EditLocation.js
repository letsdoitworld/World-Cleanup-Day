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
    const { visible, location, status } = this.props;

    const points = [];

    if (location && location.lat && location.lng) {
      const { lat, lng } = location;
      points.push({
        id: 'none',
        isTrashpile: true,
        position: { lat, lng },
        status: status || 'regular',
      });
    }

    return (
      <Modal
        contentLabel="edit-location"
        shouldCloseOnOverlayClick
        onRequestClose={this.props.onClose}
        isOpen={visible}
      >
        <MapView
          cursor="initial"
          onClick={this.handleMapClick}
          points={points}
          location={location}
        />
      </Modal>
    );
  }
}
EditLocation.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};
export default EditLocation;
