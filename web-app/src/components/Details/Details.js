import React, { Component } from 'react';
import PropTypes from 'prop-types';

import closeButton from '../../assets/closeButton.png';
import imageLocation from '../../assets/icon_location@2x.png';
import StatusText from './StatusText';
import TrashpointDate from './TrashpointDate';
import TrashPhotos from './TrashPhotos';
import TrashAmount from './TrashAmount';
import { noop } from '../../shared/helpers';
import './Details.css';

class Details extends Component {
  render() {
    const {
      marker: {
        name,
        address,
        status,
        created,
        updated,
        createdByName,
        updatedByName,
        thumbnails,
        composition,
        hashtags,
        amount,
        location,
      },
      actions,
      canEdit,
    } = this.props;
    return (
      <div className="Details">
        <div style={{ padding: '20px' }}>
          <span className="Details-name">
            {name}
          </span>
          <button
            className="Details-close-button"
            onClick={actions.onCloseDetailsClick}
          >
            <img src={closeButton} alt="" />
          </button>
          <div className="Details-address-container">
            <div>
              <img src={imageLocation} alt="" />
            </div>
            <span className="Details-address">
              {address} |
              {location
                ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(
                    6,
                  )}`
                : ''}
            </span>
          </div>
          <div className="Details-divider" />
          <StatusText status={status} />
          <TrashpointDate
            createdDate={created}
            updatedDate={updated}
            createdBy={createdByName}
            updatedBy={updatedByName}
          />
        </div>
        <div className="Details-default-container">
          <TrashPhotos photos={(thumbnails || []).map(t => t.url)} />
        </div>
        <div className="Details-default-container">
          <TrashAmount disabled amount={amount} />
        </div>
        <div className="Details-default-container">
          <span className="Details-trash-type-title">Trash type</span>
          <div className="Details-composition-tag">
            {[...composition, ...hashtags].map((text, index) =>
              (<span key={index}>
                {text}
              </span>),
            )}
          </div>
        </div>
        <div className="Details-filler" />
        {canEdit &&
          <div className="Details-edit-container">
            <span>
              Is this trashpoint information still correct and up to date?
            </span>
            <div className="buttons">
              <button onClick={actions.onEditTrashpointClick}>
                No, let's edit
              </button>
            </div>
          </div>}
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
  canEdit: PropTypes.bool,
};

Details.defaultProps = {
  actions: {
    onEditTrashpointClick: noop,
  },
  canEdit: false,
};

export default Details;
