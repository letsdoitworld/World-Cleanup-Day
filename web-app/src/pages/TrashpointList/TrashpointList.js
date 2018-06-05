import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { STATUS_COUNT_HASH } from '../../shared/trashpoint-constants';
import { actions, selectors } from '../../reducers/trashpile';
import { List } from '../../components/List';
import { TrashpointListItem } from './components/TrashpointListItem';

class TrashpointList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      pageSize: 15,
      loaded: false,
    };

    this.handleLoadMore = _.debounce(this.handleLoadMore.bind(this), 300, {
      trailing: false,
      leading: true,
    });
  }
  componentWillMount() {
    const { page, pageSize, loaded } = this.state;
    this.props
      .fetchTrashpoints({
        areaId: this.props.selectedArea.id,
        pageNumber: page,
        pageSize,
        reset: !loaded,
      })
      .then(res => {
        if (res) {
          this.setState({ loaded: true });
        }
      });
  }

  handleTrashpointClick = id => {
    if (!id) {
      return;
    }
    this.props.history.push(`/trashpoints/${id}?focus=y`, { selectedArea: this.props.selectedArea });
  };
  handleLoadMore = () => {
    if (!this.props.canLoadMore) {
      return;
    }
    const { page, pageSize } = this.state;
    this.setState(
      {
        page: page + 1,
      },
      () => {
        this.props.fetchTrashpoints({
          areaId: this.props.selectedArea.id,
          pageNumber: this.state.page,
          pageSize,
        });
      },
    );
  };
  renderItems() {
    const { trashpoints = [] } = this.props;
    return trashpoints.map(t =>
      (<TrashpointListItem
        title={t.name}
        {...t}
        key={t.id}
        handleClick={this.handleTrashpointClick}
      />),
    );
  }

  renderStatusCounts = () => {
    const { statusCounts } = this.props;
    if (!statusCounts) {
      return null;
    }

    return (
      <div className="StatusCounts-container">
        {_.map(STATUS_COUNT_HASH, (status, key) => {
          const count = statusCounts[key] || 0;
          return (
            <div className="StatusCount-container" key={key}>
              <div
                className="StatusCount-circle"
                style={{
                  border: `1px solid ${status.borderColor}`,
                  background: status.background,
                }}
              >
                <span className="StatusCount-circle-label">
                  {count}
                </span>
              </div>
              <span
                style={{ color: status.color }}
                className="StatusCount-label"
              >
                {status.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    return (
      <div style={{ display: 'flex', flex: '1', flexDirection: 'column' }}>
        <div style={{ flex: -1 }}>
          {this.renderStatusCounts()}
        </div>
        <div style={{ flex: '1' }}>
          <List
            infinite
            isInfiniteLoading={this.props.loading}
            onInfiniteLoad={this.handleLoadMore}
            items={this.renderItems()}
          />
        </div>
      </div>
    );
  }
}

const mapState = state => ({
  trashpoints: selectors.getAreasTrashpoints(state),
  loading: selectors.getAdminTrashpointsLoading(state),
  canLoadMore: selectors.canLoadMoreAreasTrashpoints(state),
  statusCounts: selectors.getStatusCounts(state),
});

const mapDispatch = dispatch => ({
  fetchTrashpoints: params => dispatch(actions.fetchAreaTrashpoints(params)),
});

TrashpointList.propTypes = {
  trashpoints: PropTypes.arrayOf(PropTypes.shape).isRequired,
  fetchTrashpoints: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  canLoadMore: PropTypes.bool.isRequired,
  statusCounts: PropTypes.any.isRequired,
};

export default connect(mapState, mapDispatch)(TrashpointList);
