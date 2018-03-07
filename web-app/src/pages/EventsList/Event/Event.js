import React, { Component } from 'react'
import './Event.css'

export class Event extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { avatar, title, author, location, numberOfParticipants, date } = this.props;

    return (
      <div>
        <div className='Event-item'>
            <div className="Event-avatar">
              <img src={avatar} />
            </div>
            <div className="Event-details">
              <div className="Event-details-part1">
                <p className="Event-title Event-info">{title}</p>
                <p className="Event-creator Event-info">{author}</p>
                <p className="Event-status Event-info">Upcoming</p>
                <p className="Event-location Event-info">{location}</p>
              </div>

              <div className="Event-details-part2">
                <p className="Event-fill Event-info">{`${numberOfParticipants - 2}/${numberOfParticipants}`}</p>
                <p className="Event-date Event-info">{date}</p>
              </div>
            </div>
        </div>
        <div className="Event-divider"></div>
      </div>
    )
  }
}
