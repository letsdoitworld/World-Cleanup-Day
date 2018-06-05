import React from 'react';
import Spinner from 'react-spinkit';

const Loader = () => {
  return (
    <div className="Spinner-wrapper">
      <Spinner name="three-bounce" color="#3E8EDE" />
    </div>
  );
};

export default Loader;
