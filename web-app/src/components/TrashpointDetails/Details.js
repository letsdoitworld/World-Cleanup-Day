import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { TRASH_COMPOSITION_TYPE_LIST } from '../../shared/constants';
import closeButton from '../../assets/closeButton.png';
import imageLocation from '../../assets/icon_location@2x.png';
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
      history,
    } = this.props;
    return (
      <div className="Tpdetails">
        <div
          onClick={() => { history.push('/trashpoints/create') }}
          className="Create-trashpoint"
        >
          <span>Place trashpoint</span>
        </div>
        {
          trashpointId &&
          <TpdetailsHeader
            tpTitle={name}
            onMinimizeClick={() => toggleDetailsWindow()}
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
                    <img src={imageLocation} alt="" />
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
                <br />
                <StatusText status={status} />
                <TrashpointDate
                  createdDate={createdAt}
                  updatedDate={updatedAt}
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
              <div className="Details-filler" />
              {canEdit &&
                <div className="Details-edit-container">
                  <span>
                    Is this trashpoint information still correct and up to date?
                  </span>
                  <div className="buttons">
                    <button onClick={actions.onEditTrashpointClick}>
                      {"No, let's edit"}
                    </button>
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
