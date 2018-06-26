import React, { Component } from 'react';
import { connect } from 'react-redux';
import {actions, selectors} from '../../reducers/teams';

class TeamList extends Component {

  componentDidMount() {
    this.props.fetchAllTeams();
  }

  render() {
    console.log(this.props);
    return (
      <div>
        SAMPLE TEXTTTTTTTTTT
      </div>
    )
  }
}

const mapState = state => ({
  teams: selectors.getAllTeams(state),
  loading: selectors.getTeamsLoading(state),
});

const mapDispatch = {
  fetchAllTeams: actions.fetchAllTeams,
};

export default connect(mapState, mapDispatch)(TeamList);