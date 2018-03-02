import React, { Component } from 'react'
import { SearchBar } from './SearchBar'
import { EventDetails } from './EventDetails'
import { Event } from './Event'
import { connect } from 'react-redux';
import './EventsList.css'

class EventsList extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    listVisible: true
  }

  render() {
    return (
      <div className="EventsList-container">
        <SearchBar onMinimizeClick={()=> this.setState({ listVisible: !this.state.listVisible })} />
        <div className={`EventsList-plot ${this.state.listVisible ? 'visible' : ''}`}>
          <Event />
          <Event />
          <Event />
          <Event />
          <Event />
        </div>
      </div>
    )
  }
}

export default connect()(EventsList)
