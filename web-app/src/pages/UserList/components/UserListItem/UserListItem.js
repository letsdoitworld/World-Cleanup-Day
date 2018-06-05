import React from 'react';

import { COUNTRIES_HASH } from '../../../../shared/countries';
import './UserListItem.css';

const UserListItem = ({ onClick, user: { pictureURL, country, name } }) => {
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
export default UserListItem;
