import React from 'react';

import { Link } from 'react-router-dom';
import logo from '../../assets/img_cleanuplogo@2x.png';
import SidebarItem from './SidebarItem';

import './Sidebar.css';

const Sidebar = ({
  authUser,
  links,
  bottomLinks,
  onLogout,
  logoutText,
  onTermsClick,
  onPrivacyClick,
}) =>
  (<div className="Sidebar">
    <Link to="/" className="Sidebar-logo-container">
      <img src={logo} alt="logo" />
    </Link>
    <div className="Sidebar-links-container">
      {links.map((link, index) => <SidebarItem {...link} key={index} />)}
    </div>
    {authUser && <SidebarItem title={authUser.name} />}
    {authUser && <SidebarItem title={authUser.email} />}
    {authUser && <br />}
    {bottomLinks.map((link, index) => <SidebarItem {...link} key={index} />)}
    <button className="Sidebar-logout" onClick={onLogout}>
      {logoutText}
    </button>
  </div>);

Sidebar.defaultProps = {
  bottomLinks: [],
  links: [],
  logoutText: 'Logout',
};

export default Sidebar;
