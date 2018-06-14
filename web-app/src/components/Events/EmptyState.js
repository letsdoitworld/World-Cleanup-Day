import React from 'react';
import PropTypes from 'prop-types';
import { noEventsCover } from '../common/Icons';

export const EmptyEventsState = ({ text, subheadNeeded }) => (
  <div className="no-events-holder">
    <img src={noEventsCover} alt="no-events-cover" />
    <div className="no-events-text">
      <p className="p1">{ text }</p>
      {
        subheadNeeded &&
        <p className="p2">
          Widen the search area or try another filter
        </p>
      }
    </div>
  </div>
);

EmptyEventsState.propTypes = {
  text: PropTypes.string,
  subheadNeeded: PropTypes.bool,
};

EmptyEventsState.defaultProps = {
  text: '',
  subheadNeeded: false,
};
