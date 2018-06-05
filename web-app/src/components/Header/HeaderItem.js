import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { If } from 'react-if';
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
        <If condition={!!image}>
          <div className="HeaderItem-img-container">
            {image}
          </div>
        </If>
        <span className="HeaderItem-title">
          {title}
        </span>
      </NavLink>
    );
  }
  return (
    <div className="HeaderItem" onClick={onClick}>
      <If condition={!!image}>
        <div className="HeaderItem-img-container">
          {image}
        </div>
      </If>
      <span className="HeaderItem-title">
        {title}
      </span>
    </div>
  );
};

HeaderItem.propTypes = {
  image: PropTypes.any,
  title: PropTypes.string.isRequired,
  url: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

HeaderItem.defaultProps = {
  image: '',
  url: '',
};

export default HeaderItem;
