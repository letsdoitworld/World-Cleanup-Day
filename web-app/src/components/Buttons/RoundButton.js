import React from 'react';

import './RoundButton.css';
import { noop } from '../../shared/helpers';

const RoundButton = ({
  onClick = noop,
  title = '',
  buttonStyle = {},
  titleStyle = {},
}) => {
  return (
    <button onClick={onClick} className="RoundButton" style={buttonStyle}>
      <span className="RoundButton-span" style={titleStyle}>{title}</span>
    </button>
  );
};

export default RoundButton;
