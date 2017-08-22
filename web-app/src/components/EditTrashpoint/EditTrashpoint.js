import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  TrashpointDate,
  TrashAmount,
  TrashPhotos,
  StatusText,
} from '../Details';

import LocationService from '../../services/Location';

import { actions as trashpileOperations } from '../../reducers/trashpile';

import { TRASH_COMPOSITION_TYPE_LIST } from '../../shared/constants';
import { EditLocation } from '../../components/EditLocation';
import { Tags } from './components/Tags';
import StatusPicker from './StatusPicker';
import closeButton from '../../assets/closeButton.png';
import imageLocation from '../../assets/icon_location@2x.png';

import './EditTrashpoint.css';

class EditTrashpoint extends Component {
  constructor(props) {
    super(props);

    const { marker } = props;
    const {
      name,
      address,
      amount,
      status,
      thumbnails,
      hashtags,
      composition,
      location,
    } = marker;

    this.state = {
      name,
      address,
      location,
      editLocation: false,
      amount,
      status,
      composition: TRASH_COMPOSITION_TYPE_LIST.map(t => ({
        label: t.label,
        value: t.type,
        selected: composition.indexOf(t.type) >= 0,
      })),
      hashtags: hashtags.map(h => ({ label: h, value: h, selected: true })),
      photos: thumbnails,
    };
  }
  // TODO implement validation
  validate = () => true;

  handleStatusChange = status => this.setState({ status: status.id });
  handleTrashpointUpdate = () => {
    const { updateTrashpoint, marker } = this.props;
    const {
      location,
      name,
      address,
      photos,
      composition,
      hashtags,
      status,
      amount,
    } = this.state;

    if (!this.validate()) {
      return;
    }

    updateTrashpoint({
      location,
      status,
      photos,
      amount,
      composition: composition.filter(t => t.selected).map(t => t.value),
      hashtags: hashtags.map(t => t.value),
      address,
      name,
      id: marker.id,
    }).then(
      res => {
        if (res) {
          this.props.actions.onTrashpointEditSuccess();
        }
      },
      err => console.log(err),
    );
  };

  handlePhotoDelete = index => {
    const { photos } = this.state;
    const photo = photos[index];
    if (photos[index].parentId) {
      photos[index].delete = true;
      this.setState({});
    } else {
      photos.splice(index, 1);
      this.setState({
        photos,
      });
    }
  };
  handlePhotoAdd = photo => {
    console.log('Photo added', photo);
  };

  handleCompositionSelect = composition => {
    composition.selected = !composition.selected;
    this.setState({});
  };
  handleTagSelect = tag => {
    tag.selected = !tag.selected;
    this.setState({});
  };
  handleTagAdd = tag => {
    this.state.hashtags.push({
      label: tag,
      value: tag,
      selected: true,
    });
    this.setState({});
  };
  handleTagDelete = tag => {
    const index = this.state.hashtags.findIndex(h => h.value === tag.value);
    if (index >= 0) {
      this.state.hashtags.splice(index, 1);
      this.setState({});
    }
  };
  handleAmountChanged = amount => {
    this.setState({ amount });
  };
  handleLocationChanged = async location => {
    const { lat, lng } = location;
    const data = await LocationService.fetchAddress({
      latitude: lat,
      longitude: lng,
    });

    this.setState({
      name: data.streetAddress,
      address: data.completeAddress,
      location: {
        latitude: lat,
        longitude: lng,
      },
    });
    this.handleEditLocationClosed();
  };
  handleEditLocationClosed = () => {
    this.setState({ editLocation: false });
  };
  handleEditLocationOpen = () => {
    this.setState({ editLocation: true });
  };

  getPhotos = () => {
    const { photos } = this.state;
    return photos.filter(p => !p.delete);
  };

  render() {
    const {
      marker: { created, updated, createdByName, updatedByName },
      actions,
    } = this.props;
    const {
      name,
      address,
      location,
      amount,
      composition,
      hashtags,
      status,
    } = this.state;
    const { latitude, longitude } = location;
    return (
      <div className="EditTrashpoint">
        <EditLocation
          onClose={this.handleEditLocationClosed}
          onLocationChange={this.handleLocationChanged}
          location={{ lat: latitude, lng: longitude }}
          visible={this.state.editLocation}
        />
        <div style={{ padding: '20px' }}>
          <span className="EditTrashpoint-name">
            {name}
          </span>
          <button
            className="EditTrashpoint-close-button"
            onClick={actions.onCloseEditClick}
          >
            <img src={closeButton} alt="" />
          </button>
          <div className="EditTrashpoint-address-container">
            <div>
              <img src={imageLocation} alt="" />
            </div>
            <span className="EditTrashpoint-address">
              {address} | {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </span>
          </div>
          <div className="EditTrashpoint-edit-location-container">
            <span
              onClick={this.handleEditLocationOpen}
              className="EditTrashpoint-edit-location-button"
            >
              Edit location
            </span>
          </div>
          <div className="EditTrashpoint-divider" />
          <StatusText status={status} />
          <TrashpointDate
            createdDate={created}
            updatedDate={updated}
            createdBy={createdByName}
            updatedBy={updatedByName}
          />
        </div>
        <div>
          <StatusPicker
            status={status}
            onStatusChange={this.handleStatusChange}
          />
        </div>
        <div className="EditTrashpoint-default-container">
          <TrashPhotos
            photos={this.getPhotos().map(t => t.url)}
            onDeleteClick={this.handlePhotoDelete}
            canEdit
          />
        </div>
        <div className="EditTrashpoint-default-container">
          <TrashAmount onSelect={this.handleAmountChanged} amount={amount} />
        </div>
        <div className="EditTrashpoint-default-container">
          <Tags
            composition={composition}
            tags={hashtags}
            onCompositionSelect={this.handleCompositionSelect}
            onTagSelect={this.handleTagSelect}
            onTagAdd={this.handleTagAdd}
            onTagDelete={this.handleTagDelete}
          />
        </div>
        <div className=" EditTrashpoint-default-container EditTrashpoint-edit-button-container">
          <div
            className="EditTrashpoint-edit-button"
            onClick={this.handleTrashpointUpdate}
          >
            <p>Save trashpoint changes</p>
          </div>
        </div>
        <div className="EditTrashpoint-filler" />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  updateTrashpoint(marker) {
    return dispatch(trashpileOperations.createMarker(marker, true));
  },
  fetchMarkerDetails(markerId) {
    return dispatch(trashpileOperations.fetchMarkerDetails(markerId));
  },
});

export default connect(undefined, mapDispatchToProps)(EditTrashpoint);
