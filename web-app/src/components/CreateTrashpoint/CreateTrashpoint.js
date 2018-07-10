import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { If } from 'react-if';
import cn from 'classnames';
import { TrashAmount, TrashPhotos } from '../TrashpointDetails';
import LocationService from '../../services/Location';
import ImageService from '../../services/Image';
import { COUNTRY_LIST } from '../../shared/countries';
import { getCountryFromStr } from '../../shared/helpers';
import { EditLocation, EditLocationInput } from '../../components/EditLocation';
import { Tags } from '../EditTrashpoint/components/Tags';
import StatusPicker from '../EditTrashpoint/StatusPicker';
import { CloseIcon, LocationIconEvent } from '../common/Icons';
import imageLocation from '../../assets/icon_location@2x.png';

import './CreateTrashpoint.css';

class CreateTrashpoint extends Component {
  static propTypes = {
    trashTypes: PropTypes.arrayOf(PropTypes.shape).isRequired,
    trashOrigin: PropTypes.arrayOf(PropTypes.shape).isRequired,
  }

  constructor(props) {
    super(props);
    const {
      trashTypes,
      trashOrigin,
    } = this.props;
    this.state = {
      name: '',
      address: '',
      country: '',
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
      buttonLocked: false,
      validation: {
        noLocation: false,
        notPermittedToCreate: false,
        noTrashType: false,
        noPhoto: false,
      },
    };
  }

  checkType = () => {
    const { typesComposition } = this.state;
    if (typesComposition.filter(c => c.selected).length === 0) {
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

  checkIfLocationPermitted = () => {
    const { userProfile } = this.props;
    const arrOfUserCountries = userProfile.areas.map(a => getCountryFromStr(a));
    if (
      this.state.country &&
      userProfile.role === 'leader' &&
      arrOfUserCountries.indexOf(this.state.country) === -1
    ) {
      return true;
    }
    return false;
  }

  checkPhotos = () => {
    const { photos } = this.state;
    if (photos.length === 0) {
      return true;
    }
    return false;
  };

  validate = async () => {
    const res = await Promise.all([
      this.checkLocation(),
      this.checkIfLocationPermitted(),
      this.checkType(),
      this.checkPhotos(),
    ]).then(
      ([ifnoLocation, ifNotPermitted, ifNoType, ifNoPhoto]) => {
        this.setState({
          validation: {
            noLocation: ifnoLocation,
            notPermittedToCreate: ifNotPermitted,
            noTrashType: ifNoType,
            noPhoto: ifNoPhoto,
          },
        });
        return {
          noLocation: ifnoLocation,
          notPermittedToCreate: ifNotPermitted,
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

    const validation = await this.validate();
    if (
      validation &&
      (validation.notPermittedToCreate || validation.noLocation || validation.noTrashType || validation.noPhoto)
    ) {
      return;
    }

    this.setState({
      buttonLocked: true,
    });

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
        if (res && !res.type) {
          this.setState({
            buttonLocked: false,
          });
          this.props.history.push(`/trashpoints/${res.id}`);
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
      validation: {
        noLocation: this.state.validation.noLocation,
        notPermittedToCreate: this.state.validation.notPermittedToCreate,
        noTrashType: this.state.validation.noTrashType,
        noPhoto: false,
      },
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
    this.state.validation = {
      noLocation: this.state.validation.noLocation,
      notPermittedToCreate: this.state.validation.notPermittedToCreate,
      noTrashType: false,
      noPhoto: this.state.validation.noPhoto,
    };
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
    let chosenCountryCode = 'WW';
    const chosenCountry =
    COUNTRY_LIST.filter(c => c.name === data.country);
    if (chosenCountry.length) {
      chosenCountryCode = chosenCountry[0].code;
    }
    this.setState({
      validation: {
        noLocation: false,
        notPermittedToCreate: false,
        noTrashType: this.state.validation.noTrashType,
        noPhoto: this.state.validation.noPhoto,
      },
      name: data.streetAddress || 'Unknown address',
      address: data.completeAddress || 'Unknown address',
      country: chosenCountryCode,
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
      validation: {
        noLocation: false,
        notPermittedToCreate: false,
        noTrashType: false,
        noPhoto: false,
      },
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
      location,
      amount,
      typesComposition,
      originComposition,
      hashtags,
      status,
      photos,
      validation,
      buttonLocked,
    } = this.state;
    const { latitude, longitude } = location || {};
    return (
      <div className="CreateTrashpoint">
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
          <div className={
              cn(
                'CreateTrashpoint-default-container',
                {
                  'error-block':
                  validation.noLocation || validation.notPermittedToCreate,
                },
              )
            }
          >
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
              {
                validation.noLocation &&
                <span className="CreateTrashpoint-err-txt">
                  You have not chosen location!
                </span>
              }
              {
                validation.notPermittedToCreate &&
                <span className="CreateTrashpoint-err-txt">
                  You can create trashpoint only in countries you are assigned to
                </span>
              }
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
          <div className={
              cn(
                'CreateTrashpoint-default-container',
                { 'error-block': validation.noTrashType },
              )
            }
          >
            <Tags
              composition={typesComposition}
              tags={hashtags}
              header={'Select trash type'}
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
          <div className="CreateTrashpoint-default-container">
            <Tags
              composition={originComposition}
              tags={[]}
              header={'Select trash origin'}
              onCompositionSelect={this.handleOriginSelect}
              onTagSelect={this.handleTagSelect}
            />
          </div>
          <div className={
              cn(
                'CreateTrashpoint-default-container',
                'scrollbar-modified',
                { 'error-block': validation.noPhoto },
              )
            }
          >
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
            <div className="CreateTrashpoint-default-container CreateTrashpoint-edit-button-container">
              <div
                className="CreateTrashpoint-edit-button"
                onClick={this.handleTrashpointUpdate}
              >
                <p>Create trashpoint</p>
              </div>
            </div> :
            <div className="CreateTrashpoint-default-container">
              <div className="CreateTrashpoint-creating">Processing...</div>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default CreateTrashpoint;
