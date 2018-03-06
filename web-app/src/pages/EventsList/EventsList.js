import React, { Component } from 'react'
import { SearchBar } from './SearchBar'
import { EventDetails } from './EventDetails'
import { Event } from './Event'
import { connect } from 'react-redux';
import './EventsList.css'
import events from '../../components/common/Data/events.json'

class EventsList extends Component {
  state = {
    listVisible: true
  }

  render() {

    return (
      <div className="EventsList-container">
        <SearchBar onMinimizeClick={()=> this.setState({ listVisible: !this.state.listVisible })} />
        <div className={`EventsList-plot ${this.state.listVisible ? 'visible' : ''}`}>
          {
            events.map((ev)=> {
              return (
                <Event
                  avatar={ev.avatar}
                  key={ev.id}
                  title={ev.title}
                  author={ev.author}
                  date={ev.date}
                  location={ev.location}
                  numberOfPatricipants={ev.number_of_patricipants}
                />
              )
            })
          }
        </div>
      </div>
    )
  }
}

export default connect()(EventsList)
