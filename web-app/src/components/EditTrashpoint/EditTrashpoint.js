import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  TrashpointDate,
  TrashAmount,
  TrashPhotos,
  StatusText,
} from '../Details';
import { AlertModal } from '../../components/AlertModal';
import LocationService from '../../services/Location';
import ImageService from '../../services/Image';
import { actions as trashpileOperations } from '../../reducers/trashpile';

import { TRASH_COMPOSITION_TYPE_LIST } from '../../shared/constants';
import { EditLocation, EditLocationInput } from '../../components/EditLocation';
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
      validationMessage: undefined,
    };
  }
  // TODO implement validation
  validate = () => {
    const { composition } = this.state;
    if (composition.filter(c => c.selected).length === 0) {
      this.setState({
        validationMessage: 'You must select at least 1 trash type',
      });
      return false;
    }
    if (this.getPhotos().length === 0) {
      this.setState({
        validationMessage: 'You must upload at least 1 photo.',
      });
      return false;
    }
    return true;
  };

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
  handlePhotoAdd = async photos => {
    if (!photos || photos.length === 0) {
      return;
    }
    const photo = photos[0];
    const base64 = await ImageService.getBase64(photo);
    const {
      base64: thumbnailBase64,
    } = await ImageService.getResizedImageBase64({
      base64,
    });

    this.setState({
      photos: [
        ...this.state.photos,
        { uri: photo.preview, base64, thumbnail: { base64: thumbnailBase64 } },
      ],
    });
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
    const filteredPhotos = photos.filter(p => !p.delete);
    return filteredPhotos;
  };

  handleTrashpointDelete = () => {
    const { marker, history } = this.props;
    if (!marker) {
      return;
    }
    this.props.deleteMarker({ markerId: marker.id }).then(res => {
      if (res) {
        history.push('/');
      }
    });
  };
  handleModalClicked = () => {
    this.setState({
      validationMessage: false,
    });
  };

  render() {
    const {
      marker: { createdAt, updatedAt, createdByName, updatedByName },
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
      validationMessage,
    } = this.state;
    const { latitude, longitude } = location;
    return (
      <div className="EditTrashpoint">
        <AlertModal
          message={validationMessage}
          isOpen={!!validationMessage}
          onClick={this.handleModalClicked}
        />
        <EditLocation
          onClose={this.handleEditLocationClosed}
          onLocationChange={this.handleLocationChanged}
          location={{ lat: latitude, lng: longitude }}
          visible={this.state.editLocation}
          status={status}
        />
        <div style={{ padding: '20px' }}>
          <span className="EditTrashpoint-name">{name}</span>
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
          <div className="CreateTrashpoint-edit-location-text">
            <EditLocationInput onChange={this.handleLocationChanged} />
          </div>
          <div className="EditTrashpoint-divider" />
          <StatusText status={status} />
          <TrashpointDate
            createdDate={createdAt}
            updatedDate={updatedAt}
            createdBy={createdByName}
            updatedBy={updatedByName}
          />
        </div>
        <div>
          <StatusPicker
            status={status}
            onStatusChange={this.handleStatusChange}
            showCleaned
          />
        </div>
        <div className="EditTrashpoint-default-container">
          <TrashPhotos
            photos={this.getPhotos().map(p => {
              if (p.url || p.uri) {
                return p.url || p.uri;
              }
              if (p.base64) {
                return `data:image/jpg;base64,${p.base64}`;
              }
            })}
            onAddClick={this.handlePhotoAdd}
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
        <div className="EditTrashpoint-default-container EditTrashpoint-edit-button-container">
          <div
            className="EditTrashpoint-edit-button"
            onClick={this.handleTrashpointUpdate}
          >
            <p>Save trashpoint changes</p>
          </div>
          <div
            className="EditTrashpoint-delete-button"
            onClick={this.handleTrashpointDelete}
          >
            <p>Delete trashpoint</p>
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
  deleteMarker: (...args) =>
    dispatch(trashpileOperations.deleteMarker(...args)),
  updateMarkerLocation: (...args) => {
    dispatch(trashpileOperations.updateMarkerLocation(...args));
  },
});

export default connect(undefined, mapDispatchToProps)(EditTrashpoint);
