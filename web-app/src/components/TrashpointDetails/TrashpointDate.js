import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import iconCreation from '../../assets/icon_creation@2x.png';
import iconUpdated from '../../assets/icon_updated@2x.png';
import './TrashpointDate.css';

const DATE_FORMAT = 'DD.MM.YYYY';

const TrashpointDate = ({
  createdDate = new Date(),
  updatedDate = new Date(),
  createdBy = '',
  updatedBy = '',
}) => {
  let createdDateStr = moment(createdDate).format(DATE_FORMAT);
  let updatedDateStr = moment(updatedDate).format(DATE_FORMAT);
  if (createdBy) {
    createdDateStr = `${createdDateStr} by ${createdBy}`;
  }

  if (updatedBy) {
    updatedDateStr = `${updatedDateStr} by ${updatedBy}`;
  }
  return (
    <div className="TrashpointDate">
      <div className="TrashpointDate-image-container">
        <img src={iconCreation} width="9px" alt="icon-creation" />
        <span className="TrashpointDate-label m-l-7">
          Created
        </span>
        <span className="TrashpointDate-date">{createdDateStr}</span>
      </div>
      <div className="TrashpointDate-image-container">
        <img src={iconUpdated} width="11px" alt="icon-updated" />
        <span className="TrashpointDate-label">
          Updated
        </span>
        <span className="TrashpointDate-date">
          {updatedDateStr}
        </span>
      </div>
    </div>
  );
};

TrashpointDate.propTypes = {
  createdDate: PropTypes.instanceOf(Date).isRequired,
  updatedDate: PropTypes.instanceOf(Date).isRequired,
  createdBy: PropTypes.string.isRequired,
  updatedBy: PropTypes.string.isRequired,
};

export default TrashpointDate;
