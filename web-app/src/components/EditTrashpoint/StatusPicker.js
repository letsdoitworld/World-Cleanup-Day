import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './StatusPicker.css';

const options = {
  regular: {
    id: 'regular',
    label: 'REGULAR',
    image: require('./images/img-regular-trashpoint@2x.png'),
    selectedImage: require('./images/img-regular-trashpoint@3x.png'),
    color: '#ff7a00',
  },
  threat: {
    id: 'threat',
    label: 'THREAT',
    image: require('./images/urgent@2x.png'),
    selectedImage: require('./images/urgent@2x.png'),
    color: '#fc515e',
  },

  cleaned: {
    id: 'cleaned',
    label: 'CLEANED',
    image: require('./images/icCleanedTrashpoint@2x.png'),
    selectedImage: require('./images/icCleanedTrashpoint@2x.png'),
    color: '#7BEA4E',
  },
};

const getOptions = ({ showCleaned }) => {
  // in order to have the same order, hard code it instead of using Object.keys
  if (showCleaned) {
    return ['regular', 'threat', 'cleaned'];
  }
  return ['regular', 'threat'];
};
const StatusPicker = ({ status, onStatusChange, showCleaned = false }) => (
  <div className="StatusPicker">
    <span className="StatusPicker-title">Point status</span>
    <span className="StatusPicker-subtitle">
      If a quick action is needed (toxic, heavy metals), please set as threat.
    </span>
    <div className="Status-statuses-container">
      {getOptions({ showCleaned }).map(key => {
        const option = options[key];
        const imageUrl = key === status ? option.selectedImage : option.image;
        return (
          <div
            key={key}
            onClick={() => onStatusChange(option)}
            className="StatusPicker-status-container"
          >
            <div className="StatusPicker-img-container">
              <img src={imageUrl} alt="" />
            </div>
            <span
              className={
                classnames('StatusPicker-status-text',
                { selected: key === status })}
            >
              {option.label}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

StatusPicker.propTypes = {
  showCleaned: PropTypes.bool,
  status: PropTypes.string,
  onStatusChange: PropTypes.func.isRequired,
};

StatusPicker.defaultProps = {
  showCleaned: false,
  status: '',
};

export default StatusPicker;
