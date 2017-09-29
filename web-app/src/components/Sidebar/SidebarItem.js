import React from 'react';
import { NavLink } from 'react-router-dom';
import './SidebarItem.css';

const SidebarItem = ({ image, title, url, strict, onClick }) => {
  if (url) {
    return (
      <NavLink activeClassName="active" to={url} className="SidebarItem" onClick={onClick}>
        {image &&
          <div className="SidebarItem-img-container">
            <img src={image} alt="link" />
          </div>}
        <span className="SidebarItem-title">
          {title}
        </span>
      </NavLink>
    );
  }
  return (
    <div className="SidebarItem">
      {image &&
        <div className="SidebarItem-img-container">
          <img src={image} alt="link" />
        </div>}
      <span className="SidebarItem-title">
        {title}
      </span>
    </div>
  );
};

export default SidebarItem;
