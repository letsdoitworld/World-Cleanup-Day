import React from 'react';
import Dropzone from 'react-dropzone';

import { noop } from '../../shared/helpers';
import './TrashPhotos.css';

const TrashPhotos = ({ photos, canEdit, onAddClick, onDeleteClick }) =>
  (<div className="TrashPhotos">
    <span className="TrashPhotos-title">Trash photos</span>
    <div className="TrashPhotos-images-container">
      {onAddClick &&
        <div
          style={{
            cursor: 'pointer',
            marginLeft: photos.length > 0 ? '5px' : '0px',
          }}
        >
          <Dropzone
            style={{
              width: '125px',
              height: '90px',
              border: '1px dashed #3e8ede',
              backgroundColor: '#fff',
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
                color: '#3e8ede',
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
            <button onClick={() => onDeleteClick(index)}>X</button>}
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
