import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import {
  CloseIcon,
} from '../common/Icons';
import './PhotoModal.css';

const PhotoModal = ({ onClose, photoUrl, isOpen }) => (
  <Modal
    isOpen={isOpen}
    style={{
      content: {
        width: '75vw',
        height: '75vh',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '10px',
        padding: 0,
        overflow: 'hidden',
        border: '1px solid #ececec',
      },
    }}
    contentLabel=""
  >
    <div className="Photo-header">
      <span className="Photo-placeholder">Trashpoint image</span>
      <button className="Shared-modal-close-button" onClick={onClose}>
        <CloseIcon />
      </button>
    </div>
    <div
      className="Photo-body"
      style={{
        backgroundImage: `url(${photoUrl})`,
      }}
    />
  </Modal>
);

PhotoModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  photoUrl: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
};

PhotoModal.defaultProps = {
  photoUrl: '',
};

export default PhotoModal;
