import React from 'react';

const getContainerStyle = index => {
  let containerStyle = {};
  if (index % 2 === 1) {
    containerStyle = {
      backgroundColor: '#F6F6F6',
    };
  }
  return containerStyle;
};

const UserAreas = ({ areas, onClick }) => (
  <div className="UserAreas-container">
    {areas.map((a, index) => (
      <div
        style={getContainerStyle(index)}
        className="UserAreas-item"
        key={a.id}
      >
        <div className="UserAreas-name">{a.name}</div>
        {onClick && (
          <div className="UserAreas-remove" onClick={() => onClick(a)}>
            x
          </div>
        )}
      </div>
    ))}
  </div>
);

export default UserAreas;
