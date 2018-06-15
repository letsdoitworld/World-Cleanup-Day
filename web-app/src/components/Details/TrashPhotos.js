import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import { noop } from '../../shared/helpers';
import { PhotoModal } from '../../components/PhotoModal';
import './TrashPhotos.css';

class TrashPhotos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showZoomedPhoto: false,
    };
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

  render() {
    const {
      photos,
      canEdit,
      onDeleteClick,
      onAddClick,
    } = this.props;
    return (
      <div className="TrashPhotos">
        <PhotoModal
           photoUrl={this.state.zoomedPhotoUrl}
           isOpen={this.state.showZoomedPhoto}
           onClose={this.handlePhotoModalClose.bind(this)}
        />
        <span className="TrashPhotos-title">Trash photos</span>
        <div className="TrashPhotos-images-container">
          {photos.map((photo, index) =>
            (<div key={index} onClick={() => this.handleThumbnailClick(index)} className="TrashPhotos-img-container">
              <img src={photo.thumbnailUrl} alt="" key={index} />
              {canEdit &&
                <button onClick={() => onDeleteClick(index)}>X</button>}
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
                multiple={false}
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
      </div>
    );
  }
}

TrashPhotos.defaultProps = {
  photos: [],
  onDeleteClick: () => noop,
  onAddClick: null,
  canEdit: false,
};
export default TrashPhotos;
