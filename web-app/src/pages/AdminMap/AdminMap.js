import React from 'react';
import { withRouter } from 'react-router-dom';

import { MarkersMap } from '../../components/MarkersMap';

class AdminMap extends React.Component {
  handleMarkerClick = marker => {
    if (marker && !marker.count) {
      this.props.history.push(`/trashpoints/${marker.id}`);
    }
  };
  render() {
    return <MarkersMap onMarkerClick={this.handleMarkerClick} />;
  }
}

export default withRouter(AdminMap);
