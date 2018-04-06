import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/en-ie';
import classnames from 'classnames';
import { TRASH_COMPOSITION_TYPE_LIST } from '../../shared/constants';
import closeButton from '../../assets/closeButton.png';
import {
  Userpic,
  LocationIconEvent,
  TimeIcon,
} from '../common/Icons';
import StatusText from './StatusText';
import TrashpointDate from './TrashpointDate';
import TrashPhotos from './TrashPhotos';
import TpdetailsHeader from './Header'
import TrashAmount from './TrashAmount';
import { Loader } from '../Spinner';
import { noop } from '../../shared/helpers';
import './Details.css';

class Details extends Component {
  render() {
    const {
      marker: {
        name,
        address,
        status,
        createdAt,
        updatedAt,
        createdByName,
        updatedByName,
        thumbnails,
        composition,
        hashtags,
        amount,
        location,
      },
      actions,
      isOpened,
      toggleDetailsWindow,
      canEdit,
      trashpointId,
      isUserAllowedAdding,
      history,
    } = this.props;
    moment.locale('en-ie');
    return (
      <div className="Tpdetails">
        {
          isUserAllowedAdding &&
          <div
            onClick={() => { history.push('/trashpoints/create') }}
            className="Create-trashpoint"
          >
            <span>Place trashpoint</span>
          </div>
        }
        {
          trashpointId &&
          <TpdetailsHeader
            tpTitle={name || "Loading..."}
            onMinimizeClick={() => history.push('/trashpoints')}
          />
        }
        {
          trashpointId &&
          (
            location ?
            <div className={ classnames('Tpdetails-plot', { 'visible': isOpened }) }>
              <div className="Details-default-container">
                <div className="Details-address-container">
                  <div>
                    <LocationIconEvent />
                  </div>
                  <span className="Details-address">
                    {address} |
                    {location
                      ? `${location.latitude.toFixed(
                          6,
                        )}, ${location.longitude.toFixed(6)}`
                      : ''}
                  </span>
                </div>
              </div>
              <div className="Details-default-container Details-creation-info">
                <span className="Details-trash-type-title">
                  Type of trashpoint
                </span>
                <br /><br />
                <StatusText status={status} />
              </div>
              <div className="Details-default-container Details-creation-info">
                <span className="Details-trash-type-title">About creator</span>
                <p className="Details-creation-info-block">
                  <Userpic />
                  <span>{createdByName}</span>
                </p>
                <p className="Details-creation-info-block">
                  <TimeIcon />
                  <span>{moment(createdAt).format('L')}</span>
                </p>
              </div>
              <div className="Details-default-container Details-creation-info">
                <span className="Details-trash-type-title">Updates</span>
                <p className="Details-creation-info-block">
                  <Userpic />
                  <span>{updatedByName}</span>
                </p>
                <p className="Details-creation-info-block">
                  <TimeIcon />
                  <span>{moment(updatedAt).format('L')}</span>
                </p>
              </div>
              <div className="Details-default-container">
                <TrashAmount disabled amount={amount} />
              </div>
              <div className="Details-default-container">
                <span className="Details-trash-type-title">Trash type</span>
                <div className="Details-composition-tag-container">
                  {[...composition, ...hashtags].map((text, index) => {
                    const isHashtag = text.indexOf('#') === 0;
                    const label = isHashtag
                      ? text
                      : (TRASH_COMPOSITION_TYPE_LIST.find(t => t.type === text) || {})
                          .label;
                    if (!label) {
                      return null;
                    }
                    return (
                      <div className="Details-composition-tag" key={index}>
                        <span className="Tag-label">{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="Details-default-container">
                <TrashPhotos photos={(thumbnails || []).map(t => t.url)} />
              </div>
              <div className="Details-filler" />
              {
                canEdit &&
                <div className="Details-default-container">
                  <div
                    className="CreateTrashpoint-edit-button"
                    onClick={actions.onEditTrashpointClick}
                  >
                    <p>Update trashpoint</p>
                  </div>
                </div>}
            </div> :
            <div className="Tpdetails-loader-container">
              <Loader />
            </div>
          )
        }
      </div>
    );
  }
}

Details.propTypes = {
  marker: PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.string,
    status: PropTypes.string,
    created: PropTypes.string,
    updated: PropTypes.string,
    createdByName: PropTypes.string,
    updatedByName: PropTypes.string,
    thumbnails: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
      }),
    ),
    composition: PropTypes.arrayOf(PropTypes.string),
    hashtags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  actions: PropTypes.shape({
    onCloseDetailsClick: PropTypes.func.isRequired,
    onEditTrashpointClick: PropTypes.func,
  }).isRequired,
  isOpened: PropTypes.bool.isRequired,
  canEdit: PropTypes.bool,
};

Details.defaultProps = {
  actions: {
    onEditTrashpointClick: noop,
  },
  canEdit: false,
};

export default Details;

/*
<button
  className="Details-close-button"
  onClick={actions.onCloseDetailsClick}
>
  <img src={closeButton} alt="" />
</button>
*/
