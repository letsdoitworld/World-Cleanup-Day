import React, { Component } from 'react'
import './Event.css'
import demo from '../../../assets/arrow@2x.png'

export class Event extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <div className='Event-item'>
            <div className="Event-avatar">
              <img src={demo} />
            </div>
            <div className="Event-details">
              <div className="Event-details-part1">
                <p className="Event-title Event-info">World Cleanup Day 2018 Estonia</p>
                <p className="Event-creator Event-info">Estelle Colon</p>
                <p className="Event-status Event-info">Upcoming</p>
                <p className="Event-location Event-info">Vilnius, Lithuania</p>
              </div>

              <div className="Event-details-part2">
                <p className="Event-fill Event-info">18/20</p>
                <p className="Event-date Event-info">28.07.2018</p>
              </div>
            </div>
        </div>
        <div className="Event-divider"></div>
      </div>
    )
  }
}
