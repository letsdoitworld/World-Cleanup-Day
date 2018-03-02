import React, { Component } from 'react'
import './EventDetails.css'
import demo from '../../assets/demo.png'
import { LocationIcon, MinimizeIcon, EventsIcon } from '../../components/common/Icons'

export class EventDetails extends Component {

  render() {
    return (
      <div className="EventDetails">
        <div className="EventDetails-cover">
          <img src={demo} />
        </div>
        <div className="EventDetails-plot">
          <div className="EventDetails-descr EventDetails-infoblock">
            <h2 className="EventDetails-header">Description</h2>
            <p>Secondary line text Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam</p>
          </div>
          <div className="Event-divider"></div>
          <div className="EventDetails-timing EventDetails-infoblock">
            <EventsIcon />
            <p>27.07.2018 - 11.30 AM</p>
          </div>
          <div className="Event-divider"></div>
          <div className="EventDetails-actions EventDetails-infoblock">
            <button>Report event</button>
            <button>Share</button>
          </div>
          <div className="Event-divider"></div>
          <div className="EventDetails-people EventDetails-infoblock">
            max 20
          </div>
          <div className="Event-divider"></div>
          <div className="EventDetails-bring EventDetails-infoblock">
            <h2 className="EventDetails-header">What to bring</h2>
            <ul>
              <li>- garbage bags</li>
              <li>- gloves</li>
              <li>- 5 shovels</li>
              <li>- 3 brooms</li>
            </ul>
          </div>
          <div className="Event-divider"></div>
          <div className="EventDetails-location EventDetails-infoblock">
            <LocationIcon />
            <p>
              Žemaitės g. 1, Trakai 21142, Lithuania |54.649311, 24.939683
            </p>
          </div>
          <div className="Event-divider"></div>
          <div className="EventDetails-creator EventDetails-infoblock">
            <h2 className="EventDetails-header">Event creator</h2>
            <p>John Galt</p>
            <p>+38010050000</p>
          </div>
          <div className="Event-divider"></div>
          <div className="EventDetails-traspoints EventDetails-infoblock">
            <h2 className="EventDetails-header">Trashpoints</h2>
          </div>
        </div>
      </div>
    )
  }
}
