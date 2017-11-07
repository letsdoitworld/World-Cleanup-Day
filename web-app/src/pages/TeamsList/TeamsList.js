import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';

import { actions, selectors } from '../../reducers/teams';
import { List } from '../../components/List';
import { Loader } from '../../components/Spinner';
import { TeamsListItem } from './components/TeamsListItem';
import './TeamsList.css';

class TeamsList extends PureComponent {
  constructor(props) {
    super(props);

    this.handleSetSort = this.handleSetSort.bind(this);

    this.state = {
      search: '',
      sortBy: 'name'
    };
  }

  componentWillMount() {
    this.props.fetchAllTeams();
  }

  handleSearchChanged = event => {
    this.setState({
      search: event.target.value
    });
  };

  handleSetSort = sortBy => {
    this.setState({
      sortBy: sortBy
    });
  };

  getFilteredTeams = () => {
    const { search } = this.state;
    const { teams } = this.props;
    if (!search || (search && search.length < 3)) {
      return teams;
    }
    return teams.filter(
      c => c.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
    );
  };

  renderItems() {
    const { loading } = this.props;
    if (loading) {
      return [
        <Loader key="0" />
      ];
    } else {
      const teams = this.getFilteredTeams();
      const teamsSorted = orderBy(
        teams,
        this.state.sortBy,
        this.state.sortBy === 'name' ? ['asc'] : ['desc']
      );
      return teamsSorted.map(t =>
        <TeamsListItem
          key={t.id}
          team={t}
        />,
      );
    }
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
          placeholder="Team name"
        />
        <div className="TeamsList-sort-container">
          Sort by:
          <button
            className={
              this.state.sortBy === 'name' ?
                'TeamsList-sort-button TeamsList-sort-button-active' :
                'TeamsList-sort-button'
            }
            onClick={() => this.handleSetSort('name')}
          >
            Name
          </button>
          <button
            className={
              this.state.sortBy === 'users' ?
              'TeamsList-sort-button TeamsList-sort-button-active' :
              'TeamsList-sort-button'
            }
            onClick={() => this.handleSetSort('users')}
          >
            Users
          </button>
          <button
            className={
              this.state.sortBy === 'trashpoints' ?
              'TeamsList-sort-button TeamsList-sort-button-active' :
              'TeamsList-sort-button'
            }
            onClick={() => this.handleSetSort('trashpoints')}
          >
            Score
          </button>
        </div>
      </div>
    );
  }

  render() {
    const { search } = this.state;
    return (
      <List
        elementHeight={62}
        headerContent={this.renderHeaderContent()}
        items={this.renderItems()}
      />
    );
  }
}

const mapState = state => ({
  teams: selectors.getAllTeams(state),
  loading: selectors.getTeamsLoading(state),
});
const mapDispatch = {
  fetchAllTeams: actions.fetchAllTeams,
};

TeamsList.propTypes = {
  teams: PropTypes.array.isRequired,
  fetchAllTeams: PropTypes.func.isRequired,
};

export default connect(mapState, mapDispatch)(TeamsList);
