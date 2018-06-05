import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import './TrashpointListItem.css';

class TrashpointListItem extends Component {

  static propTypes = {
    status: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    handleClick: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this.state = {
      selected: false,
    };
  }

  handleClick = () => {
    this.setState({
      selected: !this.state.selected,
    }, () => {
      if (this.state.selected) {
        this.props.handleClick(this.props.id);
      }
    });
  };

  render() {
    const { status, title, address } = this.props;
    const className =
    classnames('TrashpointListItem', { selected: this.state.selected });

    return (
      <div className={className} onClick={this.handleClick}>
        <div className="TrashpointListItem-status-container">
          <div className={`TrashpointListItem-${status}`} />
        </div>
        <div className="TrashpointListItem-text-container">
          <span className="TrashpointListItem-title">{title}</span>
          <span className="TrashpointListItem-address">{address}</span>
        </div>
      </div>
    );
  }
}

export default TrashpointListItem;
