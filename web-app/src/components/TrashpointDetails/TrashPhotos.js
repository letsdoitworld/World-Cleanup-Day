import React from 'react';
import Dropzone from 'react-dropzone';
import { noop } from '../../shared/helpers';
import { CloseIcon } from '../common/Icons';
import './TrashPhotos.css';

const TrashPhotos = ({ photos, canEdit, onAddClick, onDeleteClick }) =>
  (<div className="TrashPhotos">
    <span className="TrashPhotos-title">Trash photos</span>
    <div className="TrashPhotos-images-container">
      {onAddClick &&
        <div
          style={{
            cursor: 'pointer',
          }}
        >
          <Dropzone
            style={{
              width: '125px',
              height: '90px',
              border: '2px dashed #a4c7f0',
              backgroundColor: '#f6f8f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '10px',
            }}
            multiple={false}
            onDrop={onAddClick}
            accept="image/*"
          >
            <div
              style={{
                fontSize: '14px',
                color: '#a4c7f0',
                margin: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '2px',
              }}
            >
              <p style={{ textAlign: 'center' }}>Add photos</p>
            </div>
          </Dropzone>
        </div>}
      {photos.map((photo, index) =>
        (<div key={index} className="TrashPhotos-img-container">
          <img src={photo} alt="" key={index} />
          {canEdit &&
            <button onClick={() => onDeleteClick(index)}>
              <CloseIcon />
            </button>}
        </div>),
      )}
    </div>
  </div>);

TrashPhotos.defaultProps = {
  photos: [],
  onDeleteClick: () => noop,
  onAddClick: null,
  canEdit: false,
};
export default TrashPhotos;
