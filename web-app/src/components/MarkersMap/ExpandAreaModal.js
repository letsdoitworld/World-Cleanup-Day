import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { expandArea, CloseIcon } from '../common/Icons';

export const ExpandAreaModal = ({ isVisible, hideModal }) =>
  (
    <div className={classnames('Expand-area-modal', { 'Expand-area-modal-visible': isVisible })}>
      <div className="Expand-area-modal-header">
        <span className="Expand-area-modal-header-title">
          No search results
        </span>
        <div onClick={hideModal} className="Expand-area-modal-header-close">
          <CloseIcon />
        </div>
      </div>
      <img className="Coala" src={expandArea} alt="expand-area-coala" />
      <p className="Expand-area-modal-text">
        Nothing to see here! Please, widen the search area.
      </p>
      <div className="Expand-area-modal-btns">
        <div
          onClick={hideModal}
          className="Expand-area-modal-cancel Expand-area-modal-btn"
        >
          <span className="Terms-accept-button-text">Cancel</span>
        </div>
        <div
          onClick={hideModal}
          className="Expand-area-modal-close Expand-area-modal-btn"
        >
          <span className="Terms-accept-button-text">Expand</span>
        </div>
      </div>
    </div>
  );

ExpandAreaModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
};
