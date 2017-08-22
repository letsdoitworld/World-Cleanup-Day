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
    };
  }
  componentDidMount() {
    this.props.fetchUsers();
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
        headerContent={this.renderHeaderContent()}
        items={this.renderItems(users)}
      />
    );
  }
}

const mapState = state => ({
  users: selectors.getUsers(state),
});
const mapDispatch = {
  fetchUsers: actions.fetchUsers,
};

UserList.propTypes = {
  users: PropTypes.array.isRequired,
  fetchUsers: PropTypes.func.isRequired,
};

export default connect(mapState, mapDispatch)(UserList);
