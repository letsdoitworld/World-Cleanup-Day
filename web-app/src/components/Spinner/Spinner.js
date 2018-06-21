import React from 'react';
import spinner from '../../assets/loader.gif';
import './Spinner.css';

const Loader = () => {
  return (
    <div className="Spinner-wrapper">
      <div className="Spinner">
        <img src={spinner} alt="spinner" />
      </div>
    </div>
  );
};

export default Loader;
