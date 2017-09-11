import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { actions, selectors } from '../../reducers/admin';
import { List } from '../../components/List';
import { UserListItem } from './components/UserListItem';

class UserList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      page: 1,
      pageSize: 20,
      loaded: false,
      canLoadMore: true,
    };
  }
  componentDidMount() {
    // this.handleLoadMoreUsers();
  }

  getUsers = () => {
    const { search } = this.state;
    const { users } = this.props;
    if (search) {
      return (users || [])
        .filter(u => u.name.toLowerCase().indexOf(search.toLowerCase()) >= 0);
    }
    return users;
  };

  handleSearchChanged = event => {
    this.setState({ search: event.target.value });
  };
  handleUserClick = user => {
    const { id } = user;
    if (!id) {
      return;
    }
    this.props.history.push(`/users/${id}`);
  };

  handleLoadMoreUsers = () => {
    const { page, pageSize, loaded, canLoadMore } = this.state;
    const { loading } = this.props;
    if (loading || !canLoadMore) {
      return;
    }
    this.props
      .fetchUsers({
        page,
        pageSize,
        reset: !loaded,
      })
      .then(res => {
        this.setState({
          page: res.page + 1,
          canLoadMore: res.canLoadMore,
          loaded: true,
        });
      });
  };

  renderItems(users) {
    return users.map(u =>
      (<UserListItem
        onClick={() => this.handleUserClick(u)}
        key={u.id}
        user={u}
      />),
    );
  }
  renderHeaderContent() {
    return (
      <div className="List-search-container">
        <input
          className="List-search-input"
          type="text"
          value={this.state.search}
          onChange={this.handleSearchChanged}
          name="search"
          placeholder="Username or email"
        />
      </div>
    );
  }

  render() {
    const users = this.getUsers();
    return (
      <List
        elementHeight={62}
        infinite
        onInfiniteLoad={this.handleLoadMoreUsers}
        headerContent={this.renderHeaderContent()}
        items={this.renderItems(users)}
      />
    );
  }
}

const mapState = state => ({
  users: selectors.getUsers(state),
  canLoadMore: selectors.canLoadMoreUsers(state),
  lastPage: selectors.getUsersLastPage(state),
  loading: selectors.getUsersLoading(state),
  pageSize: selectors.getUsersPageSize(state),
});
const mapDispatch = {
  fetchUsers: actions.fetchUsers,
};

UserList.propTypes = {
  users: PropTypes.array.isRequired,
  fetchUsers: PropTypes.func.isRequired,
};

export default connect(mapState, mapDispatch)(UserList);
