import React from 'react';
import './Preloader.css';
import Loader from './Loader';

const Preloader = ({ isLoaded }) => {
  return (
    <div className={`preloader-overlay ${isLoaded ? 'slide-up' : ''}`}>
      <Loader />
    </div>
  );
};

export default Preloader;
