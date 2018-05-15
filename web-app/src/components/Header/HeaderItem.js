import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import './HeaderItem.css';

const HeaderItem = ({ image, title, url, onClick }) => {
  if (url) {
    return (
      <NavLink
        activeClassName="active"
        to={url}
        className="HeaderItem"
        onClick={onClick}
      >
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

HeaderItem.propTypes = {
  image: PropTypes.oneOfType([PropTypes.string, null]),
  title: PropTypes.string.isRequired,
  url: PropTypes.oneOfType([PropTypes.string, null]),
  onClick: PropTypes.func.isRequired,
};

HeaderItem.defaultProps = {
  image: null,
  url: null,
};

export default HeaderItem;
