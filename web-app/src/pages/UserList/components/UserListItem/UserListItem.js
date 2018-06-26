import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { COUNTRIES_HASH } from '../../../../shared/countries';
import './UserListItem.css';

const renderRole = (role, country) => {
  switch (role) {
    case 'leader':
      return 'Area Leader';
    case 'superadmin':
      return 'Superadmin';
    default:
      return COUNTRIES_HASH[country];
  }
};

const UserListItem = ({
  onClick,
  user: { pictureURL, country, name, role },
}) => {
  const addressContainerStyles = {};
  return (
    <div
      className={
        cn(
          'UserListItem',
          { 'UserListItem-ldr': role === 'leader' || role === 'superadmin' },
        )
      }
      onClick={onClick}
    >
      {pictureURL && (
        <img className="UserListItem-avatar" alt="avatar" src={pictureURL} />
      )}
      <div
        title={name}
        className="UserListItem-text-container"
        style={addressContainerStyles}
      >
        <span className="UserListItem-header">{name}</span>
        <span className="UserListItem-location">
          {
            renderRole(role, country)
          }
        </span>
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
