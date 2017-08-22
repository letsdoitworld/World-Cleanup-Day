import React from 'react';
import PropTypes from 'prop-types';

import './StatusPicker.css';

const options = {
  threat: {
    id: 'threat',
    label: 'THREAT',
    image: require('./images/default-status-threat@2x.png'),
    selectedImage: require('./images/selected-status-threat@2x.png'),
    color: '#fc515e',
  },
  regular: {
    id: 'regular',
    label: 'REGULAR',
    image: require('./images/default-status-regular@2x.png'),
    selectedImage: require('./images/selected-status-regular@3x.png'),
    color: '#ff7a00',
  },
  cleaned: {
    id: 'cleaned',
    label: 'CLEANED',
    image: require('./images/default-status-clean@2x.png'),
    selectedImage: require('./images/selected_status_clean@2x.png'),
    color: '#7BEA4E',
  },
};

const StatusPicker = ({ status, onStatusChange }) => {
  return (
    <div className="StatusPicker">
      <span className="StatusPicker-title">Point status</span>
      <span className="StatusPicker-subtitle">
        If a quick action is needed (toxic, heavy metals), please set as threat.
      </span>
      <div className="Status-statuses-container">
        {Object.keys(options).map(key => {
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
              <span style={{ color: option.color }}>{option.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

StatusPicker.propTypes = {
  status: PropTypes.string,
  onStatusChange: PropTypes.func.isRequired,
};

export default StatusPicker;
