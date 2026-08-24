import React, { useState, useEffect } from 'react';
import './Loader.css';

const Loader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 2500ms total loading time in App.jsx
    const duration = 2200;
    const interval = 22; 
    let current = 0;
    
    const timer = setInterval(() => {
      current += 1;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
      }
      setProgress(current);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="water-loader-container">
      <div className="water-circle">
        <div 
          className="water-fill" 
          style={{ top: `calc(100% - ${progress}%)` }}
        ></div>
        <div className="water-text">{progress}%</div>
      </div>
      <div className="custom-loader-text-group" style={{ marginTop: '32px' }}>
        <span className="custom-loader-text-small">System Initialization</span>
        <span className="custom-loader-text-large" style={{ marginTop: '8px' }}>Pongsakorn Phomekham</span>
      </div>
    </div>
  );
};

export default Loader;
