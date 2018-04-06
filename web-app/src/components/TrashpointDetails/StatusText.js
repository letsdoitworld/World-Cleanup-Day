import React from 'react';
import {
  TrashpointIcons,
} from '../common/Icons';
import iconClean from '../../assets/icon_status_small_clean@2x.png';
import iconOutdated from '../../assets/icon_status_small_outdated@2x.png';
import iconRegular from '../../assets/icon_status_small_regular@2x.png';
import iconThreat from '../../assets/icon_status_small_threat@2x.png';
import './StatusText.css';

const STATUS_STATE = {
  threat: {
    text: 'Threat',
    image: TrashpointIcons.threat,
    textStyle: { color: '#EB5757' },
    imageStyle: { height: '24px' },
  },
  cleaned: {
    text: 'Cleaned',
    image: TrashpointIcons.cleaned,
    textStyle: { color: '#5EBB38' },
    imageStyle: { height: '24px' },
  },
  outdated: {
    text: 'Outdated',
    image: TrashpointIcons.outdated,
    textStyle: { color: '#808080' },
    imageStyle: { height: '24px' },
  },
  regular: {
    text: 'Regular trashpoint',
    image: TrashpointIcons.regular,
    textStyle: { color: '#FFA613' },
    imageStyle: { height: '24px' },
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
