import React from 'react';
import Dropzone from 'react-dropzone';

import { noop } from '../../shared/helpers';
import './TrashPhotos.css';

const TrashPhotos = ({ photos, canEdit, onAddClick, onDeleteClick }) =>
  (<div className="TrashPhotos">
    <span className="TrashPhotos-title">Trash photos</span>
    <div className="TrashPhotos-images-container">
      {photos.map((photo, index) =>
        (<div key={index} className="TrashPhotos-img-container">
          <img src={photo} alt="" key={index} />
          {canEdit && photos.length > 1 && <button onClick={() => onDeleteClick(index)}>X</button>}
        </div>),
      )}
      {onAddClick &&
        <div
          style={{
            cursor: 'pointer',
            marginLeft: photos.length > 0 ? '5px' : '0px',
          }}
        >
          <Dropzone
            style={{
              width: '85px',
              height: '70px',
              backgroundColor: '#d8d8d8',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-start',
            }}
            onDrop={onAddClick}
            accept="image/*"
          >
            <div
              style={{
                height: '20px',
                width: '20px',
                fontSize: '16px',
                color: 'white',
                backgroundColor: '#4aa5ff',
                margin: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '2px',
              }}
            >
              <p style={{ textAlign: 'center' }}>+</p>
            </div>
          </Dropzone>
        </div>}
    </div>
  </div>);

TrashPhotos.defaultProps = {
  photos: [],
  onDeleteClick: () => noop,
  onAddClick: null,
  canEdit: false,
};
export default TrashPhotos;
