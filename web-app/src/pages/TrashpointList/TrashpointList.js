import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { actions, selectors } from '../../reducers/trashpile';
import { List } from '../../components/List';
import { TrashpointListItem } from './components/TrashpointListItem';
import './TrashpointList.css';

const STATUS_COUNT_HASH = {
  threat: {
    label: 'THREAT',
    color: '#FC505E',
    background: 'linear-gradient(180deg, #FE6669 0%, #FC505E 100%)',
    borderColor: '#E93A47',
  },
  regular: {
    label: 'REGULAR',
    color: '#FF7800',
    background: 'linear-gradient(180deg, #FF9900 0%, #FF7800 100%)',
    borderColor: '#EE7200',
  },
  cleaned: {
    label: 'CLEANED',
    color: '#5DBA37',
    background: 'linear-gradient(180deg, #7BEA4E 0%, #5DBA37 100%)',
    borderColor: '#57B531',
  },
  outdated: {
    label: 'OUTDATED',
    color: '#E3E3E3',
    background: 'linear-gradient(180deg, #E3E3E3 0%, #C3C3C3 100%)',
    borderColor: '#ABABAB',
  },
};

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
    const {page, pageSize, loaded} = this.state;
    this.props
      .fetchTrashpoints({
        areaId: this.props.selectedArea.id,
        pageNumber: page,
        pageSize,
        reset: !loaded,
      })
      .then(res => {
        if (res) {
          this.setState({loaded: true});
        }
      });
  }

  handleTrashpointClick = id => {
    if (!id) {
      return;
    }
    this.props.history.push(`/trashpoints/${id}?focus=y`, {selectedArea: this.props.selectedArea});
  };
  handleLoadMore = () => {
    if (!this.props.canLoadMore) {
      return;
    }
    const {page, pageSize} = this.state;
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
    const {trashpoints = []} = this.props;
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
    const {statusCounts} = this.props;
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
                style={{color: status.color}}
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
      <div className="StatusCount-block">
        <div className="MinusFlex">
          {this.renderStatusCounts()}
        </div>
        <div className="Flex">
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
  trashpoints: PropTypes.array.isRequired,
  fetchTrashpoints: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  canLoadMore: PropTypes.bool.isRequired,
};

export default connect(mapState, mapDispatch)(TrashpointList);
