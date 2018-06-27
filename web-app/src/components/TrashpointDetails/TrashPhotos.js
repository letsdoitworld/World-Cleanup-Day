import React from 'react';
import Dropzone from 'react-dropzone';
import Swiper from 'react-id-swiper';
import { If } from 'react-if';
import PropTypes from 'prop-types';
import { CloseIcon } from '../common/Icons';
import './TrashPhotos.css';

const swiperOptions = (if1slide, if2slides) => {
  if (if1slide) {
    return {
      slidesPerView: 1,
      centeredSlides: true,
    };
  }
  if (if2slides) {
    return {
      slidesPerView: 2,
      centeredSlides: false,
      spaceBetween: 40,
    };
  }
  return {
    slidesPerView: 2,
    centeredSlides: false,
    spaceBetween: 40,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  };
};

const TrashPhotos = ({
  photos,
  canEdit,
  onAddClick,
  onDeleteClick,
}) =>
  (<div className="TrashPhotos">
    <span className="TrashPhotos-title">Trash photos</span>
    <div className="TrashPhotos-images-container">
      <If condition={!!onAddClick}>
        <div className="cur-p">
          <Dropzone
            className="TrashPhotos-dropzone"
            multiple={false}
            onDrop={onAddClick}
            accept="image/*"
          >
            <div
              className="TrashPhotos-dropzone-placeholder"
            >
              <p className="t-a-c">Add photos</p>
            </div>
          </Dropzone>
        </div>
      </If>
      {
        onAddClick ?
        photos.map((photo, index) =>
          (<div key={photo} className="TrashPhotos-img-container-create">
            <div
              className="TrashPhotos-img-container-create-img"
              style={{
                backgroundImage: `url(${photo})`
              }}
            />
            {canEdit &&
              <button onClick={() => onDeleteClick(index)}>
                <CloseIcon />
              </button>}
          </div>),
        ) :
        <Swiper {...swiperOptions(photos.length === 1, photos.length === 2)}>
          {photos.map((photo, index) =>
            (<div key={photo} className="TrashPhotos-img-container">
              <div
                className="TrashPhotos-img-container-img"
                style={{
                  backgroundImage: `url(${photo})`
                }}
              />
              {canEdit &&
                <button onClick={() => onDeleteClick(index)}>
                  <CloseIcon />
                </button>}
            </div>),
          )}
        </Swiper>
      }
    </div>
  </div>);

TrashPhotos.propTypes = {
  photos: PropTypes.arrayOf(PropTypes.string),
  onDeleteClick: PropTypes.func,
  onAddClick: PropTypes.func,
  canEdit: PropTypes.bool,
};

TrashPhotos.defaultProps = {
  photos: [],
  onDeleteClick: null,
  onAddClick: null,
  canEdit: false,
};
export default TrashPhotos;
