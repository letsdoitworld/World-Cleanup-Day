import React, { Component } from 'react';

import './TrashpointListItem.css';

class TrashpointListItem extends Component   {
  constructor() {
    super();
    this.state = {
      selected: false
    }
  }

  handleClick = () => {
    this.setState({
      selected: !this.state.selected
    },() => {
      if(this.state.selected){
        this.props.handleClick(this.props.id);
      }
    });
  };

  render() {
    const {status, title, address} = this.props;
    const className = `TrashpointListItem ${this.state.selected ? 'selected' : ''}`;

    return <div className={className} onClick={this.handleClick}>
      <div className="TrashpointListItem-status-container">
        <div className={`TrashpointListItem-${status}`}></div>
      </div>
      <div className="TrashpointListItem-text-container">
        <span className="TrashpointListItem-title">{title}</span>
        <span className="TrashpointListItem-address">{address}</span>
      </div>
    </div>;
  }
}

export default TrashpointListItem;
