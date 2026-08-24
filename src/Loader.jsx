import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <div className="custom-loader-container">
      <div className="custom-loader-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className="custom-loader-text-group">
        <span className="custom-loader-text-small">Welcome to Portfolio</span>
        <span className="custom-loader-text-large">Pongsakorn Phomekham</span>
      </div>
    </div>
  );
};

export default Loader;
