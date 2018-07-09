import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import Swiper from 'react-id-swiper';
import { If } from 'react-if';
import PropTypes from 'prop-types';
import { CloseIcon } from '../common/Icons';
import { PhotoModal } from '../PhotoModal';
import './TrashPhotos.css';

class TrashPhotos extends Component {

  state = {
    showZoomedPhoto: false,
  }

  handlePhotoModalClose = () => {
    this.setState({
      showZoomedPhoto: false,
    });
  };

  handleThumbnailClick = index => {
    const { photos } = this.props;
    this.setState({
      zoomedPhotoUrl: photos[index].mediumPhotoUrl,
      showZoomedPhoto: true,
    });
  }

  swiperOptions = (if1slide, if2slides) => {
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

  render() {
    const {
      photos,
      canEdit,
      isEditMode,
      onAddClick,
      onDeleteClick,
    } = this.props;
    return (
      <div className="TrashPhotos scrollbar-modified">
        <PhotoModal
          photoUrl={this.state.zoomedPhotoUrl}
          isOpen={this.state.showZoomedPhoto}
          onClose={this.handlePhotoModalClose.bind(this)}
        />
        <span className="TrashPhotos-title">Trash photos</span>
        <div className="TrashPhotos-images-container scrollbar-modified">
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
            isEditMode ?
            photos.map((photo, index) =>
              (<div
                key={photo}
                className="TrashPhotos-img-container-create"
              >
                <div
                  className="TrashPhotos-img-container-create-img"
                  style={{
                    backgroundImage: `url(${photo})`,
                  }}
                />
                {canEdit &&
                  <button onClick={() => onDeleteClick(index)}>
                    <CloseIcon />
                  </button>}
              </div>),
            ) :
            <Swiper {...this.swiperOptions(photos.length === 1, photos.length === 2)}>
              {photos.map((photo, index) =>
                (<div
                  key={photo.thumbnailUrl}
                  className="TrashPhotos-img-container scrollbar-modified"
                  onClick={() => this.handleThumbnailClick(index)}
                >
                  <div
                    className="TrashPhotos-img-container-img"
                    style={{
                      backgroundImage: `url(${photo.thumbnailUrl})`,
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
      </div>
    );
  }
}

TrashPhotos.propTypes = {
  photos: PropTypes.arrayOf(PropTypes.string),
  onDeleteClick: PropTypes.func,
  onAddClick: PropTypes.func,
  canEdit: PropTypes.bool,
  isEditMode: PropTypes.bool,
};

TrashPhotos.defaultProps = {
  photos: [],
  onDeleteClick: null,
  onAddClick: null,
  isEditMode: false,
  canEdit: false,
};
export default TrashPhotos;
