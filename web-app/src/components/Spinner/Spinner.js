import React from 'react';
import Spinner from 'react-spinkit';

const Loader = () => {
  return <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Spinner name="three-bounce" color="#3E8EDE" />
  </div>
};

export default Loader;
