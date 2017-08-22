import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Tag = ({ label, selected, onSelect, onDelete }) =>
  (<div className={classnames('Tag-container', { selected })} onClick={onSelect}>
    <span className="Tag-label">
      {label}
    </span>
    {onDelete && <div onClick={onDelete} className="Tag-delete-container">X</div>}
  </div>);

Tag.propTypes = {
  label: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
  onDelete: PropTypes.func,
};

export default Tag;
