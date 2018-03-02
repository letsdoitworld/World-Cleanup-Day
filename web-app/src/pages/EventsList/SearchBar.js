import React, { Component } from 'react'
import { LocationIcon, MinimizeIcon } from '../../components/common/Icons'

export const SearchBar = ({
  onMinimizeClick
})=> {
  return (
    <div className="EventsList-searchbar">
      <LocationIcon />
      <input className="EventsList-searchbar-query" type='text' placeholder="Search location" />
      <div style={{ width: '16px', height: '16px', cursor: 'pointer' }} onClick={()=> onMinimizeClick()}>
        <MinimizeIcon />
      </div>
    </div>
  )
}
