import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export const SearchThisArea = ({ isVisible, onSearchClick }) => (
  <div
    onClick={onSearchClick}
    className={
      classnames('Search-this-area', { 'Search-this-area-visible': isVisible })
    }
  >
    Search this area
  </div>
);

SearchThisArea.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onSearchClick: PropTypes.func.isRequired,
};
