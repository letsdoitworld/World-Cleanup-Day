import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
import classnames from 'classnames';
import { If, Else } from 'react-if';
import { EmptyTeamsState } from './EmptyTeamsState';
import { actions, selectors } from '../../reducers/teams';
import { Loader } from '../../components/Spinner';
import { TeamsListItem } from './components/TeamsListItem';
import {
  SearchIcon,
  ExpandIcon,
  CollapseIcon,
} from '../../components/common/Icons';
import './TeamsList.css';

const LENGTH_SEARCH_START = 3;

class TeamsList extends PureComponent {
  constructor(props) {
    super(props);

    this.handleSetSort = this.handleSetSort.bind(this);

    this.state = {
      search: '',
      sortBy: 'name',
      plotVisible: true,
    };
  }

  componentWillMount() {
    this.props.fetchAllTeams();
  }

  getFilteredTeams = () => {
    const { search } = this.state;
    const { teams } = this.props;
    if (!search || (
      search && search.length < LENGTH_SEARCH_START)) {
      return teams;
    }
    return teams.filter(
      c => c.name.toLowerCase().indexOf(search.toLowerCase()) !== -1,
    );
  };

  handleSearchChanged = event => {
    this.setState({
      search: event.target.value,
    });
  };

  handleSetSort = sortBy => {
    this.setState({ sortBy });
  };

  handleTeamClick = id => {
    if (!id) {
      return;
    }
    this.props.history.push(`/teams/${id}`);
  };

  renderItems() {
    const { loading } = this.props;
    if (loading) {
      return [
        <Loader />
      ];
    } else {
      const teams = this.getFilteredTeams();
      const teamsSorted = orderBy(
        teams,
        this.state.sortBy,
        this.state.sortBy === 'name' ? ['asc'] : ['desc']
      );
      return teamsSorted.length ?
        teamsSorted.map(t =>
          (<TeamsListItem
            key={t.id}
            team={t}
            fetchTeam={() => this.handleTeamClick(t.id)}
          />),
        ) :
        <EmptyTeamsState />;
    }
  }

  renderContent() {
    const { plotVisible } = this.state;
    return (
      <div className="TeamsList-container">
        <div className="TeamsList-header">
          <SearchIcon />
          <input
            className="TeamsList-search-input"
            type="text"
            value={this.state.search}
            onChange={this.handleSearchChanged}
            name="search"
            placeholder="Team name"
          />
          <div
            className="TeamsList-minimize"
            onClick={
              () => this.setState({ plotVisible: !this.state.plotVisible })
            }
          >
            {
              plotVisible ?
                <CollapseIcon /> :
                <ExpandIcon />
            }
          </div>
        </div>
        <div className={
            classnames(
              'TeamsList-plot',
              'scrollbar-modified',
              { isVisible: plotVisible },
            )
          }
        >
          <div className="TeamsList-items">
            {
              this.renderItems()
            }
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      this.renderContent()
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

/*
<div className="TeamsList-sort-container">
  Sort by:
  <button
    className={classnames('TeamsList-sort-button', {'TeamsList-sort-button-active': this.state.sortBy === 'name'})}
    onClick={() => this.handleSetSort('name')}
  >
    Name
  </button>
  <button
    className={classnames('TeamsList-sort-button', {'TeamsList-sort-button-active': this.state.sortBy === 'users'})}
    onClick={() => this.handleSetSort('users')}
  >
    Users
  </button>
  <button
    className={classnames('TeamsList-sort-button', {'TeamsList-sort-button-active': this.state.sortBy === 'trashpoints'})}
    onClick={() => this.handleSetSort('trashpoints')}
  >
    Score
  </button>
</div>
*/
