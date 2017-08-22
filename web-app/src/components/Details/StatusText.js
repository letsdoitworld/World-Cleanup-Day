import React from 'react';

import iconClean from '../../assets/icon_status_small_clean@2x.png';
import iconOutdated from '../../assets/icon_status_small_outdated@2x.png';
import iconRegular from '../../assets/icon_status_small_regular@2x.png';
import iconThreat from '../../assets/icon_status_small_threat@2x.png';
import './StatusText.css';

const STATUS_STATE = {
  threat: {
    text: 'This point is a threat! ',
    image: iconThreat,
    textStyle: { color: '#EB5757' },
    imageStyle: { height: '15px' },
  },
  cleaned: {
    text: 'This point is cleaned! ',
    image: iconClean,
    textStyle: { color: '#5EBB38' },
    imageStyle: { height: '13px' },
  },
  outdated: {
    text: 'This point is outdated! ',
    image: iconOutdated,
    textStyle: { color: '#808080' },
    imageStyle: { height: '14px' },
  },
  regular: {
    text: 'This point is a regular trashpoint. ',
    image: iconRegular,
    textStyle: { color: '#FF7A00' },
    imageStyle: { height: '14px' },
  },
};

const StatusText = ({ status }) => {
  const state = STATUS_STATE[status];
  if (!state) {
    return null;
  }
  return (
    <div className="StatusText">
      <img src={state.image} style={state.imageStyle} alt="" />
      <span style={state.textStyle}>
        {state.text}
      </span>
    </div>
  );
};

export default StatusText;
