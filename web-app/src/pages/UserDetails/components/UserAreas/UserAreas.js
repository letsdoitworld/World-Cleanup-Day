import React from 'react';
import { If } from 'react-if';
import FlagIcon from 'react-flag-kit/lib/FlagIcon';
import PropTypes from 'prop-types';

const UserAreas = ({ areas, onClick }) => (
  <div className="UserAreas-container">
    {areas.map((a) => (
      <div
        className="UserAreas-item"
        key={a.id}
      >
        <FlagIcon
          size={40}
          code={a.id}
        />
        <div className="UserAreas-name-block">
          <span className="UserAreas-name">{a.name}</span>
        </div>
        <If condition={!!onClick}>
          <div>
            <span
              className="UserAreas-remove"
              onClick={() => onClick(a)}
            >
              Remove
            </span>
          </div>
        </If>
      </div>
    ))}
  </div>
);

UserAreas.propTypes = {
  areas: PropTypes.any,
  onClick: PropTypes.func,
};

UserAreas.defaultProps = {
  areas: [],
  onClick: null,
};

export default UserAreas;
