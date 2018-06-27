import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';

import { actions, selectors } from '../../reducers/admin';
import { List } from '../../components/List';
import {
  SearchIcon,
  BackIcon,
  CollapseIcon,
  ExpandIcon,
} from '../../components/common/Icons';
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
      area: props.location && props.location.search
        ? props.location.search
               .substring(1, props.location.search.length)
               .split('=')[1]
        : undefined,
      pageSearch: 1,
      pageSizeSearch: 20,
      notSearched: false
    };

    this.handleSearchDebounced = debounce(() => {
      this.setState({
        pageSearch: 1,
        pageSizeSearch: 20,
      },
      () => this.handleLoadMoreUsers(true));
    }, 300);
  }

  componentWillMount() {
    this.handleLoadMoreUsers(true);
  }

  handleSearchChanged = event => {
    this.setState(
      { search: event.target.value },
      () => this.handleSearchDebounced()
    );
  };

  handleUserClick = user => {
    const { id } = user;
    if (!id) {
      return;
    }
    this.props.history.push(`/users/${id}`);
  };

  handleLoadMoreUsers = (isSearch, isLoadingMore) => {
    const {
      page,
      pageSize,
      loaded,
      canLoadMore,
      area,
      search,
      pageSearch,
      pageSizeSearch,
      notSearched,
    } = this.state;
    const { loading } = this.props;
    const validSearch = search && search.length >= 3;


    const fetchUsersParams = {
      page,
      pageSize,
      reset: !loaded,
      area,
    };

    if (isSearch && validSearch) {
      fetchUsersParams.page = pageSearch;
      fetchUsersParams.pageSize = pageSizeSearch;
      fetchUsersParams.nameSearch = search.substring(0, 10);
      fetchUsersParams.isLoadingMore = isLoadingMore;

      if (loading || !canLoadMore) {
        if (notSearched && isLoadingMore) {
          return;
        }
      }

      return this.props
                 .fetchUsers(fetchUsersParams)
                 .then(res => {
                   this.setState({
                     pageSearch: res.page + 1,
                     canLoadMore: res.canLoadMore,
                     loaded: true,
                     page: 1,
                     notSearched: true,
                   });
                 });
    }

    if (loading || !canLoadMore) {
      if (!notSearched) {
        return;
      } else {
        fetchUsersParams.reset = true;
      }
    }

    this.props
        .fetchUsers(fetchUsersParams)
        .then(res => {
          this.setState({
            page: res.page + 1,
            canLoadMore: res.canLoadMore,
            loaded: true,
            pageSearch: 1,
            notSearched: false,
          });
        });
  };

  renderItems() {
    return this.props.users.map(u =>
      (<UserListItem
        onClick={() => this.handleUserClick(u)}
        key={u.id}
        user={u}
        setUserLocked={this.props.setUserLocked}
      />),
    );
  }

  renderHeaderContent() {
    const {
      total,
      toggleUserslistWindow,
      userslistWindowVisible,
      history,
    } = this.props;
    return (
      <div className="UsersList-header">
        <div onClick={() => history.goBack()} className="UsersList-goback">
          <BackIcon />
        </div>
        <SearchIcon />
        <input
          className="UsersList-search-input"
          type="text"
          value={this.state.search}
          onChange={this.handleSearchChanged}
          name="search"
          placeholder="Search users"
        />
        {
          /*
          <div className="UsersList-search-total">
            {total ? total : 0} users
          </div>
          */
        }
        <div
          role="button"
          className="UsersList-header-minimize"
          onClick={toggleUserslistWindow}
        >
          {
            userslistWindowVisible ?
              <CollapseIcon /> :
              <ExpandIcon />
          }
        </div>
      </div>
    );
  }

  render() {
    const { search } = this.state;
    const { userslistWindowVisible, loading } = this.props;
    return (
      <List
        elementHeight={70}
        infinite
        loading={loading}
        userslistWindowVisible={userslistWindowVisible}
        onInfiniteLoad={
          () => this.handleLoadMoreUsers(search && search.length >= 3, true)
        }
        headerContent={this.renderHeaderContent()}
        items={this.renderItems()}
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
  total: selectors.getTotalUsers(state),
  userslistWindowVisible: selectors.getShowUserslistWindow(state),
});
const mapDispatch = {
  fetchUsers: actions.fetchUsers,
  toggleUserslistWindow: actions.toggleUserslistWindow,
  setUserLocked: actions.setUserLocked,
};

UserList.propTypes = {
  users: PropTypes.array.isRequired,
  fetchUsers: PropTypes.func.isRequired,
};

export default connect(mapState, mapDispatch)(UserList);
