import React from 'react';

const TERMS_URL =
  'https://storeldiweustaging.blob.core.windows.net/static-resources/privacy.html';

const Privacy = () =>
  (<div className="Privacy-container">
    <iframe className="Privacy-frame" src={TERMS_URL} />
  </div>);

export default Privacy;
