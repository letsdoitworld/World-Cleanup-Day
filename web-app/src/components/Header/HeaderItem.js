import React from 'react';
import { NavLink } from 'react-router-dom';
import './HeaderItem.css';

const HeaderItem = ({ image, title, url, onClick }) => {
  if (url) {
    return (
      <NavLink activeClassName="active" to={url} className="HeaderItem" onClick={onClick}>
        {
          image &&
          <div className="HeaderItem-img-container">
            {image}
          </div>
        }
        <span className="HeaderItem-title">
          {title}
        </span>
      </NavLink>
    );
  }
  return (
    <div className="HeaderItem" onClick={onClick}>
      {
        image &&
        <div className="HeaderItem-img-container">
          {image}
        </div>
      }
      <span className="HeaderItem-title">
        {title}
      </span>
    </div>
  );
};

export default HeaderItem;
