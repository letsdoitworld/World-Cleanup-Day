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
  SearchIcon,
} from '../../../../components/common/Icons';

class AreaList extends React.Component {
  componentWillMount() {
    const { loading, areas, getAreas } = this.props;
    getAreas();
  }

  handleListItemClick = area => {
    if (this.props.onClick) {
      this.props.onClick(area);
    }
  };

  handleCloseClick = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  renderInnerAreaList = () => {
    const { loading, areas, error, userId } = this.props;
    if (loading) {
      return <Loader />;
    }
    if (error) {
      return <div>{error}</div>;
    }
    const NO_COUNTRY_ID = 'NOC';
    return (
      <div className="AreaAssignList-items">
        {areas.filter(a => a.id !== NO_COUNTRY_ID).map((a, i) =>
          (<AreaListItem
            rightLabel={this.renderRightLabel}
            onClick={this.handleListItemClick}
            index={i}
            area={a}
            key={a.id}
            needsChildren
          />),
        )}
      </div>
    );
  };

  renderRightLabel = area => {
    const { userId } = this.props;
    if (Array.isArray(area.leaderId)) {
      if (area.leaderId.indexOf(userId) !== -1) {
        return '';
      }
    }
    if (typeof (area.leaderId) === 'string' && area.leaderId === userId) {
      return '';
    }
    return 'Assign';
  };

  render() {
    const { getAreas } = this.props;
    return (
      <div className="AreaAssignList-сontainer">
        <div
          className="AreaAssignList-header"
        >
          {
            /*
            <SearchIcon />
            <input
              className="UsersList-search-input"
              type="text"
              name="search"
              placeholder="Search areas to assign"
              onChange={
                e => {
                  e.target.value.length > 2 ?
                  getAreas(e.target.value) :
                  getAreas();
                }
              }
            />
            */
          }
          <span className="UsersList-search-input" />
          <div
            onClick={this.handleCloseClick}
            className="AreaAssignList-header-close"
          >
            <CloseIcon />
          </div>
        </div>
        <div className="AreaAssignList-plot scrollbar-modified">
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
