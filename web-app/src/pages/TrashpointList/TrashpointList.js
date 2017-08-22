import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { actions, selectors } from '../../reducers/trashpile';
import { List } from '../../components/List';
import { TrashpointListItem } from './components/TrashpointListItem';

class TrashpointList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      pageSize: 15,
    };

    this.handleLoadMore = _.debounce(this.handleLoadMore.bind(this), 300, {
      trailing: false,
      leading: true,
    });
  }
  componentWillMount() {
    const { page, pageSize } = this.state;
    this.props.fetchTrashpoints({
      areaId: this.props.selectedArea.id,
      pageNumber: page,
      pageSize,
    });
  }

  handleTrashpointClick = id => {
    if (!id) {
      return;
    }
    this.props.history.push(`/trashpoints/${id}?focus=y`);
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
  }
  renderItems() {
    const { trashpoints = [] } = this.props;
    return trashpoints.map(t =>
      <TrashpointListItem
        title={t.name}
        {...t}
        key={t.id}
        handleClick={this.handleTrashpointClick}
      />,
    );
  }

  render() {
    return (
      <List
        infinite
        isInfiniteLoading={this.props.loading}
        onInfiniteLoad={this.handleLoadMore}
        items={this.renderItems()}
      />
    );
  }
}

const mapState = state => ({
  trashpoints: selectors.getAreasTrashpoints(state),
  loading: selectors.getAdminTrashpointsLoading(state),
  canLoadMore: selectors.canLoadMoreAreasTrashpoints(state),
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
