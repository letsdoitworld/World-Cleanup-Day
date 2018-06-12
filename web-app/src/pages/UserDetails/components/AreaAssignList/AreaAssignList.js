import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Loader } from '../../../../components/Spinner';
import { AreaListItem } from '../../../../components/AreaListItem';

import {
  selectors as areaSels,
  actions as areaActs,
} from '../../../../reducers/areas';
import {
  CloseIcon,
} from '../../../../components/common/Icons';

class AreaList extends React.Component {
  componentWillMount() {
    const { loading, areas, getAreas } = this.props;

    if ((!areas || areas.length === 0) && !loading) {
      getAreas();
    }
  }
  handleListItemClick = area => {
    if (this.props.onClick) {
      this.props.onClick(area);
    }
  };
  renderRightLabel = area => (area.leaderId ? '' : 'Assign');
  renderInnerAreaList = () => {
    const { loading, areas, error, userId } = this.props;
    if (loading) {
      return <Loader />;
    }
    if (error) {
      return <div>{error}</div>;
    }
    return (
      <div className="AreaAssignList-items">
        {areas.map((a, i) =>
          (<AreaListItem
            rightLabel={this.renderRightLabel}
            onClick={this.handleListItemClick}
            index={i}
            area={a}
            key={a.id}
          />),
        )}
      </div>
    );
  };
  handleCloseClick = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };
  render() {
    return (
      <div className="AreaAssignList-сontainer">
        <div
          className="AreaAssignList-header"
          onClick={this.handleCloseClick}
        >
          <span className="placeholder" />
          <CloseIcon />
        </div>
        <div className="AreaAssignList-plot">
          {this.renderInnerAreaList()}
        </div>
      </div>
    );
  }
}
AreaList.defaultProps = {
  areas: undefined,
};
AreaList.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.any.isRequired,
  areas: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      parentId: PropTypes.string,
      leaderId: PropTypes.string,
    }),
  ),
  getAreas: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

const mapState = state => ({
  areas: areaSels.getNestedAreas(state).filter(a => a.id !== '-'),
  loading: areaSels.areAreasLoading(state),
  error: areaSels.hasAreasError(state),
});
const mapDispatch = {
  getAreas: areaActs.getAreas,
};

export default connect(mapState, mapDispatch)(AreaList);
