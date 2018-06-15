import React from 'react';
import PropTypes from 'prop-types';
import { COUNTRIES_HASH } from '../../../../shared/countries';
import './UserListItem.css';

const UserListItem = ({
  onClick,
  user: { pictureURL, country, name },
}) => {
  const addressContainerStyles = {};
  return (
    <div className="UserListItem" onClick={onClick}>
      {pictureURL && (
        <img className="UserListItem-avatar" alt="avatar" src={pictureURL} />
      )}
      <div
        title={name}
        className="UserListItem-text-container"
        style={addressContainerStyles}
      >
        <span className="UserListItem-header">{name}</span>
        <span className="UserListItem-location">{COUNTRIES_HASH[country]}</span>
      </div>
    </div>
  );
};

UserListItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  user: PropTypes.shape({
    pictureURL: PropTypes.string,
    country: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
    locked: PropTypes.bool,
  }).isRequired,
};

export default UserListItem;
