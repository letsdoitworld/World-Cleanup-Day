import React from 'react';
import { NavLink } from 'react-router-dom';
import './FooterItem.css';

const FooterItem = ({ image, title, url, strict, onClick }) => {
  if (url) {
    return (
      <NavLink activeClassName="active" to={url} className="FooterItem" onClick={onClick}>
        {image &&
          <div className="FooterItem-img-container">
            <img src={image} alt="link" />
          </div>}
        <span className="FooterItem-title">
          {title}
        </span>
      </NavLink>
    );
  }
  return (
    <div className="FooterItem">
      {image &&
        <div className="FooterItem-img-container">
          <img src={image} alt="link" />
        </div>}
      <span className="FooterItem-title">
        {title}
      </span>
    </div>
  );
};

export default FooterItem;
