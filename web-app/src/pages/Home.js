import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Sidebar } from '../components/Sidebar';
import { List, TrashpointListItem, UserListItem } from '../components/List';
import {
  selectors as trashpileSelectors,
  actions as trashpileActions,
} from '../reducers/trashpile';
import {
  selectors as adminSelectors,
  actions as adminActions,
} from '../reducers/admin';
import MapView from '../components/MapView';
import trashpointIcon from '../assets/trashpoint_menu.png';
import userIcon from '../assets/user_menu.png';
import { Details } from '../components/Details';
import { EditTrashpoint } from '../components/EditTrashpoint';
import './Home.css';

const SIDEBAR_LINKS = [
  { image: trashpointIcon, title: 'Trashpoints', selected: true },
  { image: userIcon, title: 'Users', selected: false },
];

const LINKS = {
  Trashpoints: 0,
  Users: 1,
  0: 'Trashpoints',
  1: 'Users',
};

const TRASHPOINTS_TABS = ['All trashpoints', 'My trashpoints'];

class Home extends Component {
  constructor() {
    super();

    this.state = {
      search: '',
      selectedIndexLink: 0,
      links: SIDEBAR_LINKS.map((link, index) => ({
        ...link,
        onClick: this.handleLinkClick(index),
      })),
      trashpointTabs: TRASHPOINTS_TABS,
      trashpointTabSelected: 0,
      showDetails: false,
      showEdit: false,
    };
  }

  handleLinkClick = index => () => {
    this.setState(
      {
        search: '',
        selectedIndexLink: index,
        links: this.state.links.map((link, linkIndex) => ({
          ...link,
          selected: linkIndex === index,
        })),
        showDetails: false,
        showEdit: false
      },
      () => {
        if (index === LINKS.Trashpoints) {
          this.props.fetchAdminTrashpoints(50, 1);
        } else if (index === LINKS.Users ) {
          this.props.fetchUsers({page: 1, pageSize: 20 });
        }
      },
    );
  };
  handleSearchChanged = search => {
    this.setState({ search });
  };

  componentWillMount() {
    this.props.fetchAdminTrashpoints(50, 1);
  }

  renderListItems = () => {
    const index = this.state.selectedIndexLink;

    if (index === 0) {
      return this.getTrashpointsItems();
    }
    return this.getUserItems();
  };

  getUserItems = () => {
    return this.props.users.map(user =>
      <UserListItem key={user.id} user={user} />,
    );
  };

  handleTrashpointClick = marker => {
    const markerId = typeof marker === 'object' ? marker.id : marker;
    if (!!markerId) {
      this.setState(
        {
          showDetails: true,
          showEdit: false
        },
        () => {
          this.props.fetchMarkerDetails(markerId);
        },
      );
    }
  };

  getTrashpointsItems = () =>
    this.props.trashpoints.map(trashpoint =>
      <TrashpointListItem
        title={trashpoint.name}
        {...trashpoint}
        key={trashpoint.id}
        handleClick={this.handleTrashpointClick}
      />,
    );

  renderList = () => {
    const { selectedIndexLink } = this.state;
    const isTrashpoints = selectedIndexLink === LINKS.Trashpoints;
    const isUsers = selectedIndexLink === LINKS.Users;
    let headerContent = null;
    if (isUsers) {
      headerContent = (
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

    const listComponent = (
      <List headerContent={headerContent} items={this.renderListItems()} />
    );

    return listComponent;
  };

  handleOnCloseDetailsClick = () => {
    this.setState({ showDetails: false });
  };

  handleOnCloseEditClick = () => {
    this.setState({ showEdit: false, showDetails: true });
  };

  handleEditTrashpoint = () => {
    this.setState({ showEdit: true });
  };

  actions = {
    onCloseDetailsClick: this.handleOnCloseDetailsClick,
    onCloseEditClick: this.handleOnCloseEditClick,
    onEditTrashpointClick: this.handleEditTrashpoint,
  };

  renderDetails = () => {
    return (
      <Details
        marker={this.props.markerDetails}
        actions={this.actions}
        canEdit
      />
    );
  };

  renderEdit = () => {
    return (
      <EditTrashpoint
        marker={this.props.markerDetails}
        actions={this.actions}
      />
    );
  };

  render() {
    const { links, showDetails, showEdit } = this.state;
    let sidebarContent = null;
    if (showEdit) {
      sidebarContent = this.renderEdit();
    } else {
      sidebarContent = showDetails ? this.renderDetails() : this.renderList();
    }
    return (
      <div className="Home">
        <Sidebar links={links} />
        {sidebarContent}
        <div className="Home-map-container">
          <MapView
            points={this.props.trashpoints}
            onPointClick={this.handleTrashpointClick}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  trashpoints: trashpileSelectors.getAllMarkers(state),
  getUsersLoading: adminSelectors.getUsersLoading(state),
  users: adminSelectors.getUsers(state),
  markerDetails: trashpileSelectors.getMarkerDetails(state),
  userProfile: adminSelectors.getUser(state)
});

const mapDispatchToProps = {
  fetchAdminTrashpoints: trashpileActions.fetchAdminTrashpoints,
  fetchMarkerDetails: trashpileActions.fetchMarkerDetails,
  fetchUsers: adminActions.fetchUsers,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
