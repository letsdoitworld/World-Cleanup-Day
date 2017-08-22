import React from 'react';

import './ImageButton.css';

const ImageButton = ({ title, image, onClick }) => {
  return (
    <div className="ImageButton">
      {image &&
        <div className="ImageButton-img-container">
          <img src={image} alt="some icon" />
        </div>}
      <button onClick={onClick} className="ImageButton-button">
        <span className="ImageButton-title">{title}</span>
      </button>
    </div>
  );
};

export default ImageButton;
