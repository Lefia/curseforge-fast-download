import React from 'react';
import icon from '@images/icon-32.png';

export default function Nav() {
  const openSetting = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <nav className="navbar bg-body-tertiary pt-3 px-2">
      <div className="container-fluid">
        <h4 className="navbar-brand">
          <img
            className="d-inline-block align-text-top me-2"
            height="24"
            width="24"
            src={icon}
          ></img>
          Fast <span className="text-primary">Download</span>
        </h4>
        <button id="setting" className="btn" onClick={openSetting}>
          <i className="fa-solid fa-gear h5"></i>
        </button>
      </div>
    </nav>
  );
}
