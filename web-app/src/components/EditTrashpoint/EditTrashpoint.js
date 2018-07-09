import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { If } from 'react-if';
import cn from 'classnames';
import {
  TrashAmount,
  TrashPhotos,
} from '../TrashpointDetails';
import LocationService from '../../services/Location';
import ImageService from '../../services/Image';
import { actions as trashpileOperations } from '../../reducers/trashpile';
import {
  CloseIcon,
  LocationIconEvent,
  Userpic,
  TimeIcon,
} from '../common/Icons';
import { EditLocation, EditLocationInput } from '../../components/EditLocation';
import { Tags } from './components/Tags';
import StatusPicker from './StatusPicker';
import { Loader } from '../Spinner';

import './EditTrashpoint.css';

class EditTrashpoint extends Component {
  constructor(props) {
    super(props);

    const { marker, trashTypes, trashOrigin } = props;
    const {
      name,
      address,
      amount,
      status,
      thumbnails,
      hashtags,
      composition,
      origin,
      location,
    } = marker;

    this.state = {
      name,
      address,
      location,
      editLocation: false,
      amount,
      status,
      composition: trashTypes.map(t => ({
        label: t.label,
        value: t.type,
        selected: composition.indexOf(t.type) >= 0,
      })),
      origin: trashOrigin.map(o => ({
        label: o.label,
        value: o.type,
        selected: origin ? origin.indexOf(o.type) >= 0 : false,
      })),
      hashtags: hashtags.map(h => ({ label: h, value: h, selected: true })),
      photos: thumbnails,
      photosUploadCounter: thumbnails.length,
      buttonLocked: false,
      validation: {
        noLocation: false,
        noTrashType: false,
        noPhoto: false,
      },
    };
  }

  checkType = () => {
    const { composition } = this.state;
    if (composition.filter(c => c.selected).length === 0) {
      return true;
    }
    return false;
  };

  checkLocation = () => {
    const { location } = this.state;
    if (!location) {
      return true;
    }
    return false;
  };

  checkPhotos = () => {
    const { photos } = this.state;
    if (photos.filter(p => !p.delete).length === 0) {
      return true;
    }
    return false;
  };

  validate = async () => {
    const res = await Promise.all([
      this.checkLocation(),
      this.checkType(),
      this.checkPhotos(),
    ]).then(
      ([ifNoLocation, ifNoType, ifNoPhoto]) => {
        this.setState({
          validation: {
            noLocation: ifNoLocation,
            noTrashType: ifNoType,
            noPhoto: ifNoPhoto,
          },
        });
        return {
          noLocation: ifNoLocation,
          noTrashType: ifNoType,
          noPhoto: ifNoPhoto,
        };
      },
      () => {
        return false;
      });
    return res;
  };

  handleStatusChange = status => this.setState({ status: status.id });

  handleTrashpointUpdate = async () => {
    const { updateTrashpoint, marker } = this.props;
    const {
      location,
      name,
      address,
      photos,
      composition,
      origin,
      hashtags,
      status,
      amount,
    } = this.state;
    const validation = await this.validate();
    if (
      validation &&
      (validation.noLocation || validation.noTrashType || validation.noPhoto)
    ) {
      return;
    }
    this.setState({
      buttonLocked: true,
    });
    updateTrashpoint({
      location,
      status,
      photos,
      amount,
      composition: composition.filter(t => t.selected).map(t => t.value),
      origin: origin.filter(o => o.selected).map(o => o.value),
      hashtags: hashtags.map(t => t.value),
      address,
      name,
      id: marker.id,
    }).then(
      res => {
        if (res) {
          this.setState({
            buttonLocked: false,
          });
          this.props.actions.onTrashpointEditSuccess();
        }
      },
      err => {
        this.setState({
          buttonLocked: false,
        });
        console.log(err);
      },
    );
  };

  handlePhotoDelete = index => {
    const { photos } = this.state;
    const photo = photos[index];
    photos[index].delete = true;
    this.setState({});
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
      validation: {
        noLocation: this.state.validation.noLocation,
        noTrashType: this.state.validation.noTrashType,
        noPhoto: false,
      },
      photos: [
        ...this.state.photos,
        { uri: photo.preview, base64, thumbnail: { base64: thumbnailBase64 } },
      ],
    });
  };

  handleIfMorePhotosPossible = photos => {
    // user can add only 3 photos per one edit
    // deleted photos not counting
    const { photosUploadCounter } = this.state;
    const permittedCountPerOneEdit = 3;
    const filteredPhotos = photos.filter(p => !p.delete);
    if (
      filteredPhotos.length - photosUploadCounter < permittedCountPerOneEdit
    ) {
      return true;
    }
    return false;
  }

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
    this.setState({
      buttonLocked: true,
    });
    this.props.deleteMarker({ markerId: marker.id }).then(res => {
      this.setState({
        buttonLocked: false,
      });
      if (res) {
        history.push('/trashpoints');
      }
    });
  };

  render() {
    const {
      marker: {
        createdAt,
        updatedAt,
        creator,
        updater,
        id,
      },
      actions,
    } = this.props;
    const {
      address,
      location,
      amount,
      composition,
      origin,
      photos,
      hashtags,
      status,
      validation,
      buttonLocked,
    } = this.state;
    const { latitude, longitude } = location;
    return (
      <div className="EditTrashpoint">
        <EditLocation
          onClose={this.handleEditLocationClosed}
          onLocationChange={this.handleLocationChanged}
          location={{ lat: latitude, lng: longitude }}
          visible={this.state.editLocation}
          status={status}
        />
        <div className="EditTrashpoint-header">
          <span className="EditTrashpoint-title">
            Edit trashpoint
          </span>
          <div
            className="EditTrashpoint-close-button"
            onClick={
              () => this.props.history.push(`/trashpoints/${id}`)
            }
          >
            <CloseIcon />
          </div>
        </div>
        <div className="EditTrashpoint-plot scrollbar-modified">
          <div>
            <div className="EditTrashpoint-default-container">
              <div className="EditTrashpoint-address-container">
                <span className="EditTrashpoint-address">
                  {address} | {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </span>
              </div>
              <div className="EditTrashpoint-edit-location-container">
                <LocationIconEvent />
                <span
                  onClick={this.handleEditLocationOpen}
                  className="EditTrashpoint-edit-location-button"
                >
                  Edit location
                </span>
                <EditLocationInput onChange={this.handleLocationChanged} />
              </div>
            </div>
          </div>
          {
            creator &&
            <div className="Details-default-container Details-creation-info">
              <span className="Details-trash-type-title">About creator</span>
              <p className="Details-creation-info-block">
                <Userpic />
                <span>{creator.name}</span>
              </p>
              <p className="Details-creation-info-block">
                <TimeIcon />
                <span>{moment(createdAt).format('L')}</span>
              </p>
            </div>
          }
          {
            updater &&
            <div className="Details-default-container Details-creation-info">
              <span className="Details-trash-type-title">Updates</span>
              <p className="Details-creation-info-block">
                <Userpic />
                <span>{updater.name}</span>
              </p>
              <p className="Details-creation-info-block">
                <TimeIcon />
                <span>{moment(updatedAt).format('L')}</span>
              </p>
            </div>
          }
          <div className="EditTrashpoint-default-container">
            <StatusPicker
              status={status}
              onStatusChange={this.handleStatusChange}
              showCleaned
            />
          </div>
          <div className="EditTrashpoint-default-container">
            <TrashAmount onSelect={this.handleAmountChanged} amount={amount} />
          </div>
          <div className={
              cn(
                'EditTrashpoint-default-container',
                { 'error-block': validation.noTrashType },
              )
            }
          >
            <Tags
              header="Trash types"
              composition={composition}
              tags={hashtags}
              onCompositionSelect={this.handleCompositionSelect}
              onTagSelect={this.handleTagSelect}
              onTagAdd={this.handleTagAdd}
              onTagDelete={this.handleTagDelete}
            />
            <If condition={validation.noTrashType}>
              <span className="CreateTrashpoint-err-txt">
                You have not chosen any trash type!
              </span>
            </If>
          </div>
          <div className="EditTrashpoint-default-container">
            <Tags
              header="Trash origin"
              tags={[]}
              composition={origin}
              onCompositionSelect={this.handleCompositionSelect}
              onTagSelect={this.handleTagSelect}
            />
          </div>
          <div className={
              cn(
                'EditTrashpoint-default-container',
                'scrollbar-modified',
                { 'error-block': validation.noPhoto },
              )
            }
          >
            <TrashPhotos
              photos={this.getPhotos().map(p => {
                if (p.url || p.uri) {
                  return p.url || p.uri;
                }
                if (p.base64) {
                  return `data:image/jpg;base64,${p.base64}`;
                }
              })}
              onAddClick={this.handleIfMorePhotosPossible(photos) ? this.handlePhotoAdd : undefined}
              onDeleteClick={this.handlePhotoDelete}
              isEditMode
              canEdit
            />
            <If condition={validation.noPhoto}>
              <span className="CreateTrashpoint-err-txt">
                You have not added any photos!
              </span>
            </If>
          </div>
          {
            !buttonLocked ?
            <div className="EditTrashpoint-default-container EditTrashpoint-edit-button-container">
              <div
                className="EditTrashpoint-edit-button"
                onClick={this.handleTrashpointUpdate}
              >
                <p>Save trashpoint changes</p>
              </div>
              <br />
              <div
                className="EditTrashpoint-delete-button"
                onClick={this.handleTrashpointDelete}
              >
                <p>Delete trashpoint</p>
              </div>
            </div> :
            <div className="EditTrashpoint-default-container EditTrashpoint-edit-button-container">
              <div className="EditTrashpoint-uploading">Processing...</div>
            </div>
          }
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  updateTrashpoint(marker) {
    return dispatch(trashpileOperations.createMarker(marker, true));
  },
  fetchMarkerDetails(markerId) {
    return dispatch(trashpileOperations.fetchMarkerDetails(markerId, true));
  },
  deleteMarker: (...args) =>
    dispatch(trashpileOperations.deleteMarker(...args)),
  updateMarkerLocation: (...args) => {
    dispatch(trashpileOperations.updateMarkerLocation(...args));
  },
});

export default connect(undefined, mapDispatchToProps)(EditTrashpoint);
