import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TrashAmount, TrashPhotos } from '../TrashpointDetails';

import LocationService from '../../services/Location';
import ImageService from '../../services/Image';
import { actions as trashpileOperations, selectors } from '../../reducers/trashpile';
import { AlertModal } from '../../components/AlertModal';
import { EditLocation, EditLocationInput } from '../../components/EditLocation';
import { Tags } from '../EditTrashpoint/components/Tags';
import StatusPicker from '../EditTrashpoint/StatusPicker';
import { CloseIcon, LocationIconEvent } from '../common/Icons';
import imageLocation from '../../assets/icon_location@2x.png';

import './CreateTrashpoint.css';

class CreateTrashpoint extends Component {
  constructor(props) {
    super(props);
    const {
      trashTypes,
      trashOrigin,
    } = this.props;
    this.state = {
      name: '',
      address: '',
      location: undefined,
      editLocation: false,
      amount: 'handful',
      status: 'regular',
      typesComposition: trashTypes.map(t => ({
        label: t.label,
        value: t.type,
        selected: false,
      })),
      originComposition: trashOrigin.map(o => ({
        label: o.label,
        value: o.type,
        selected: false,
      })),
      hashtags: [],
      photos: [],
      validationMessage: undefined,
    };
  }
  // TODO implement validation
  validate = () => {
    const { typesComposition, location, photos } = this.state;
    if (typesComposition.filter(c => c.selected).length === 0) {
      this.setState({
        validationMessage: 'You must select at least 1 trash type',
      });
      return false;
    }
    if (!location) {
      this.setState({
        validationMessage: 'You must select a location.',
      });
      return false;
    }
    if (photos.length === 0) {
      this.setState({
        validationMessage: 'You must upload at least 1 photo.',
      });
      return false;
    }
    return true;
  };
  handleStatusChange = status => this.setState({ status: status.id });
  handleTrashpointUpdate = () => {
    const { createTrashpoint } = this.props;
    const {
      location,
      name,
      address,
      photos,
      typesComposition,
      originComposition,
      hashtags,
      status,
      amount,
    } = this.state;
    if (!this.validate()) {
      return;
    }

    createTrashpoint({
      location,
      status,
      photos,
      amount,
      composition: typesComposition.filter(t => t.selected).map(t => t.value),
      origin: originComposition.filter(o => o.selected).map(o => o.value),
      hashtags: hashtags.map(t => t.value),
      address,
      name,
    }).then(
      res => {
        if (res) {
          this.props.history.push(`/trashpoints/${res.id}`);
        }
      },
      err => console.log(err),
    );
  };

  handlePhotoDelete = index => {
    const { photos } = this.state;
    photos.splice(index, 1);
    this.setState({
      photos,
    });
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
        {
          uri: photo.preview,
          base64,
          thumbnail: {
            base64: thumbnailBase64,
          },
        },
      ],
    });
  };

  handleCompositionSelect = composition => {
    composition.selected = !composition.selected;
    this.setState({});
  };

  handleOriginSelect = origin => {
    origin.selected = !origin.selected;
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
      name: data.streetAddress || 'Unknown address',
      address: data.completeAddress || 'Unknown address',
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
  handleCloseClick = () => {
    this.props.history.push('/trashpoints');
  };

  handleModalClicked = () => {
    this.setState({
      validationMessage: false,
    });
  };

  hasAddressLineSet = () => {
    const { location, address } = this.state;
    const { latitude, longitude } = location || {};
    return !!address || !!latitude || !!longitude;
  };

  renderAddressLine = () => {
    const { location, address } = this.state;
    const { latitude, longitude } = location || {};
    if (address && latitude && longitude) {
      return `${address} | ${location.latitude.toFixed(
        6,
      )}, ${location.longitude.toFixed(6)}`;
    }
    if (address) {
      return address;
    }
    if (latitude && longitude) {
      return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(
        6,
      )}`;
    }
  };

  render() {
    const {
      name,
      address,
      location,
      amount,
      typesComposition,
      originComposition,
      hashtags,
      status,
      photos,
      validationMessage,
    } = this.state;
    const { latitude, longitude } = location || {};

    return (
      <div className="CreateTrashpoint">
        <AlertModal
          message={validationMessage}
          isOpen={!!validationMessage}
          onClick={this.handleModalClicked}
        />
        <EditLocation
          onClose={this.handleEditLocationClosed}
          onLocationChange={this.handleLocationChanged}
          location={location ? { lat: latitude, lng: longitude } : undefined}
          visible={this.state.editLocation}
          status={status}
        />
        <div className="CreateTrashpoint-header">
          <span className="CreateTrashpoint-title">
            Add trashpoint
          </span>
          <button
            className="CreateTrashpoint-close-button"
            onClick={this.handleCloseClick}
          >
            <CloseIcon />
          </button>
        </div>
        <div className="CreateTrashpoint-plot scrollbar-modified">
          <div className="CreateTrashpoint-default-container">
            <div className="CreateTrashpoint-address-container">
              <div>
                {this.hasAddressLineSet() && <img src={imageLocation} alt="" />}
              </div>
              <span className="CreateTrashpoint-address">
                {this.renderAddressLine()}
              </span>
            </div>
            <div className="CreateTrashpoint-edit-location-container">
              <LocationIconEvent />
              <span
                onClick={this.handleEditLocationOpen}
                className="CreateTrashpoint-edit-location-button"
              >
                Edit location
              </span>
              <EditLocationInput onChange={this.handleLocationChanged} />
            </div>
          </div>
          <div className="CreateTrashpoint-default-container">
            <StatusPicker
              status={status}
              onStatusChange={this.handleStatusChange}
            />
          </div>
          <div className="CreateTrashpoint-default-container">
            <TrashAmount onSelect={this.handleAmountChanged} amount={amount} />
          </div>
          <div className="CreateTrashpoint-default-container">
            <Tags
              composition={typesComposition}
              tags={hashtags}
              header={'Select trash type'}
              onCompositionSelect={this.handleCompositionSelect}
              onTagSelect={this.handleTagSelect}
              onTagAdd={this.handleTagAdd}
              onTagDelete={this.handleTagDelete}
            />
          </div>
          <div className="CreateTrashpoint-default-container">
            <Tags
              composition={originComposition}
              tags={[]}
              header={'Select trash origin'}
              onCompositionSelect={this.handleOriginSelect}
              onTagSelect={this.handleTagSelect}
            />
          </div>
          <div className="CreateTrashpoint-default-container">
            <TrashPhotos
              onAddClick={photos.length < 3 ? this.handlePhotoAdd : undefined}
              photos={photos.map(p => {
                if (p.url || p.uri) {
                  return p.url || p.uri;
                }
                if (p.base64) {
                  return `data:image/jpg;base64,${p.base64}`;
                }
              })}
              onDeleteClick={this.handlePhotoDelete}
              canEdit
            />
          </div>
          <div className="CreateTrashpoint-default-container CreateTrashpoint-edit-button-container">
            <div
              className="CreateTrashpoint-edit-button"
              onClick={this.handleTrashpointUpdate}
            >
              <p>Create trashpoint</p>
            </div>
          </div>
          <div className="CreateTrashpoint-filler" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  trashTypes: selectors.getTrashTypes(state),
  trashOrigin: selectors.getTrashOrigin(state),
});

const mapDispatchToProps = dispatch => ({
  createTrashpoint(marker) {
    return dispatch(trashpileOperations.createMarker(marker, false));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateTrashpoint);


/*
<StatusText status={status} />

*/
