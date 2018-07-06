import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { NavLink } from 'react-router-dom';
import { If, Else } from 'react-if';
import { actions, selectors } from '../../reducers/teams';
import {
  TrashpointListItem,
} from '../TrashpointList/components/TrashpointListItem';
import {
  TrashpointList,
} from '../../components/Events/EventTrashpointList/TrashpointList';
import {
  TrashpointDetails,
} from '../TrashpointDetails';
import { Loader } from '../../components/Spinner';
import {
  BackIcon,
  ExpandIcon,
  CollapseIcon,
  LocationIconEvent,
  RubbishIconActive,
  ParticipantsIcon,
} from '../../components/common/Icons';
import { COUNTRIES_HASH } from '../../shared/countries';

class TeamDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      pageSize: 15,
      loaded: false,
      isVisible: true,
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
    this.props.history.push(`/trashpoints/${id}?focus=y`, { selectedTeamId: this.props.team.id });
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

    const options = {
      threat: {
        id: 'threat',
        label: 'THREAT',
        selectedImage: require('./images/urgent@2x.png'),
        color: '#fc515e',
      },
      regular: {
        id: 'regular',
        label: 'REGULAR',
        selectedImage: require('./images/img-regular-trashpoint@2x.png'),
        color: '#ff7a00',
      },
      cleaned: {
        id: 'cleaned',
        label: 'CLEANED',
        selectedImage: require('./images/icCleanedTrashpoint@2x.png'),
        color: '#7BEA4E',
      },
    };

    return (
      <div className="TeamDetails-statuses">
        {_.map(options, (status, key) => {
          const count = statusCounts[key] || 0;
          return (
            <div className="TeamDetails-statuses-body" key={key}>
              <img
                className="TeamDetails-statuses-img"
                src={status.selectedImage}
                alt="tp"
              />
              <p className="TeamDetails-statuses-tp-count">
                {count}
              </p>
            </div>
          );
        })}
      </div>
    );
  };


  handleBackClick = () => {
    this.props.history.goBack();
  };

  render() {
    const { team, match: { params } } = this.props;
    const { isVisible } = this.state;
    const teamsListCondition = !!(params.id && !params.trashpoints && !params.tpId);
    const tpListCondition = !!(params.id && params.trashpoints && !params.tpId);
    const tpDetCondition = !!(params.id && params.trashpoints && params.tpId);

    return (
      <div className="TeamDetails-container">
        <div className="TeamDetails-header">
          <div
            onClick={this.handleBackClick}
            className="TeamDetails-header-back"
          >
            <BackIcon />
          </div>
          <div className="TeamDetails-header-title">
            {team.name || 'Loading...'}
          </div>
          <div
            className="TeamDetails-header-minimize"
          >
            {
              isVisible ?
                <CollapseIcon /> :
                <ExpandIcon />
            }
          </div>
        </div>
        <div className="TeamDetails-plot">
          <If condition={team.id === params.id}>
            <div>
              {
                teamsListCondition &&
                <div>
                  <div className="TeamDetails-flex TeamDetails-infoblock">
                    <LocationIconEvent />
                    <span className="TeamDetails-textfield">
                      {team.CC ? COUNTRIES_HASH[team.CC] : 'Global'}
                    </span>
                  </div>
                  <div className="TeamDetails-members TeamDetails-infoblock">
                    <h2 className="TeamDetails-infoblock-header">Members</h2>
                    <p>
                      <ParticipantsIcon />
                      <span className="TeamDetails-textfield">
                        {team.members}
                      </span>
                    </p>
                  </div>
                  <NavLink to={`/teams/${team.id}/trashpoints`}>
                    <div
                      className="TeamDetails-trashpoints TeamDetails-infoblock"
                    >
                      <h2 className="TeamDetails-infoblock-header">
                        Trashpoints
                      </h2>
                      <p>
                        <RubbishIconActive />
                        <span className="TeamDetails-preview">
                          Click to preview trashpoints
                        </span>
                        <span className="pointer">{'>'}</span>
                        <span className="TeamDetails-trashpoints-num">
                          {team.trashpoints}
                        </span>
                      </p>
                    </div>
                  </NavLink>
                  <div className="TeamDetails-infoblock">
                    {this.renderStatusCounts()}
                  </div>
                  <div className="TeamDetails-descr TeamDetails-infoblock">
                    <h2 className="TeamDetails-infoblock-header">
                      Description
                    </h2>
                    <span>
                      {team.teamDescription}
                    </span>
                  </div>
                </div>
              }
              {
                tpListCondition &&
                <TrashpointList
                  trashpoints={team.lastTrashpoints || []}
                  targetSection={'teams'}
                  targetId={team.id}
                />
              }
              {
                tpDetCondition &&
                <TrashpointDetails
                  trashpointId={params.tpId}
                />
              }
            </div>
            <Else>
              <Loader />
            </Else>
          </If>
        </div>
      </div>
    );
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
