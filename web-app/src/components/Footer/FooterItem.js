import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { If } from 'react-if';
import './FooterItem.css';

const FooterItem = ({ image, title, url, onClick }) => {
  if (url) {
    return (
      <NavLink
        activeClassName="active"
        to={url}
        className="FooterItem"
        onClick={onClick}
      >
        <If condition={!!image}>
          <div className="FooterItem-img-container">
            <img src={image} alt="link" />
          </div>
        </If>
        <span className="FooterItem-title">
          {title}
        </span>
      </NavLink>
    );
  }
  return (
    <div className="FooterItem">
      <If condition={!!image}>
        <div className="FooterItem-img-container">
          <img src={image} alt="link" />
        </div>
      </If>
      <span className="FooterItem-title">
        {title}
      </span>
    </div>
  );
};

FooterItem.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

FooterItem.defaultProps = {
  image: '',
  onClick: () => {},
};

export default FooterItem;
