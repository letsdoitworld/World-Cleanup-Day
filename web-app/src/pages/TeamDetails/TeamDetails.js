import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { actions, selectors } from '../../reducers/teams';
import { List } from '../../components/List';
import { TrashpointListItem } from '../TrashpointList/components/TrashpointListItem';
import { Loader } from '../../components/Spinner';
import imageMembers from '../../assets/ic_organization@3x.png';
import imageLocation from '../../assets/icon_location@3x.png';
import { COUNTRIES_HASH } from '../../shared/countries';

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

class TeamDetails extends Component {
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
    const { fetchTeam, match: { params } } = this.props;
    fetchTeam(params.id);
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
    const trashpoints = this.props.team.lastTrashpoints || [];
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
    const statusCounts = this.props.team.groupCount;
    if (!statusCounts) {
      return null;
    }

    return (
      <div className="StatusCounts-container">
        {_.map(STATUS_COUNT_HASH, (status, key) => {
          const count = statusCounts[key] || 0;
          return (
            <div className="StatusCount-container" key={key}>
              {console.log({ status, count })}
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


  handleBackClick = () => {
    this.props.history.push('/teams');
  };

  oneOrMany = (number, str) => (number === 0 || number) && (number === 1 ? `${number} ${str}` : `${number} ${str}s`);

  render() {

    const { team, match: { params } } = this.props;

    return team.id === params.id ?
      <div className="AreaList">
        <div className='AreaList-top-band'>
          <div
            onClick={this.handleBackClick}
            className='AreaList-top-band-back'>
            <div className='AreaList-top-band-left-arrow'/>
          </div>
          <div className="AreaList-top-band-area">{team.name}</div>
        </div>
        < div className='TeamDetails-body'>
          <div className='TeamDetails-logo'>
            <img className='TeamDetails-logo' src={team.image}/>
          </div>
          <div>
            <div className="TeamDetails-members">
              <img className="TeamDetails-members-icon" src={imageLocation}/>
              <p className='TeamDetails-members-p'>
                {team.CC ? COUNTRIES_HASH[team.CC] : 'Global'}
              </p>
            </div>
            <div className="TeamDetails-members">
              <img className="TeamDetails-members-icon" src={imageMembers}/>
              <p className='TeamDetails-members-p'>
                {this.oneOrMany(team.members, 'member')}
              </p>
            </div>
          </div>
        </div>
        <p className='TeamDetails-description-p'>{team.teamDescription}</p>
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
      </div> :
      <div className="AreaList">
        <Loader/>
      </div>
      ;
  }
}

const mapState = state => ({
  team: selectors.getSelectedTeam(state),
  loading: selectors.getSelectedTeamLoading(state),
});

const mapDispatch = dispatch => ({
  fetchTeam: params => dispatch(actions.fetchTeam(params)),
});

TeamDetails.propTypes = {
  trashpoints: PropTypes.array.isRequired,
  fetchTrashpoints: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  canLoadMore: PropTypes.bool.isRequired,
};

export default connect(mapState, mapDispatch)(TeamDetails);
