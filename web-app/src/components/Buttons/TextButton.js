import React from 'react';

import './TextButton.css';
import { noop } from '../../shared/helpers';

const TextButton = ({
  onClick = noop,
  title = '',
  buttonStyle = {},
  titleStyle = {},
}) => {
  return (
    <button onClick={onClick} className="TextButton" style={buttonStyle}>
      <span className="TextButton-span" style={titleStyle}>{title}</span>
    </button>
  );
};

export default TextButton;
