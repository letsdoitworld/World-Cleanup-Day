import React, { Component } from 'react'
import { LocationIcon, MinimizeIcon } from '../../components/common/Icons'

export const SearchBar = ({
  onMinimizeClick,
  event
})=> {

  return (
    <div className="EventsList-searchbar">
      {
        !event ?
        <LocationIcon /> :
        <button style={{ width: '16px', height: '16px', cursor: 'pointer' }}>{ '<' }</button>
      }
      {
        !event ?
        <input className="EventsList-searchbar-query" type='text' placeholder="Search location" /> :
        <span>Time to clean Vilnius!</span>
      }
      <div style={{ width: '16px', height: '16px', cursor: 'pointer' }} onClick={()=> onMinimizeClick()}>
        <MinimizeIcon />
      </div>
    </div>
  )
}
