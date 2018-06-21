import React from 'react';

import bin from '../../../assets/ic-trashpoint-active-copy.png';
import arrowDown from '../../../assets/arrow-drop-down-blue.png';
import events from '../../../assets/events.png';
import location from '../../../assets/ic-location.png';
import locationBlue from '../../../assets/ic-location-ev.png';
import locationBlack24px from '../../../assets/icLocationOnBlack24Px.png';
import locationPinActive from '../../../assets/icLocationPinActive.png';
import locationPinInactive from '../../../assets/icLocationPinInactive.png';
import groupBlack24px from '../../../assets/icGroupBlack24Px.png';
import search from '../../../assets/ic-search.png';
import users from '../../../assets/ic-users.png';
import hidePanel from '../../../assets/hide-panel.png';
import fb from '../../../assets/ic-facebook-active.png';
import google from '../../../assets/ic-google-plus-active.png';
import share from '../../../assets/share.png';
import participants from '../../../assets/ic-participant.png';
import close from '../../../assets/ic-close.png';
import date from '../../../assets/ic-date.png';
import report from '../../../assets/ic-report.png';
import email from '../../../assets/ic-email.png';
import phone from '../../../assets/ic-phone.png';
import userpicHolder from '../../../assets/placeholder-userpic.png';
import back from '../../../assets/ic-back.png';
import collapse from '../../../assets/collapse.png';
import expand from '../../../assets/expand.png';
import time from '../../../assets/ic-time.png';
import logout from '../../../assets/logout.png';
import rubbish from '../../../assets/icDeleteInactive.png';
import rubbishActive from '../../../assets/ic-organization.png';

import human from '../../../assets/ic-name-copy.png';

import eventCover from '../../../assets/img-event-cover-small-1.png';
import eventCoverBig from '../../../assets/img-event-cover-big-1.png';
import noEventsCover from '../../../assets/img-no-events.png';
import noUsersCover from '../../../assets/img-no-users.png';
import expandArea from '../../../assets/img-expand-small.png';
import errorImg from '../../../assets/img-error.png';

import activeCleanedTP from '../../../assets/trashpoints/icActiveCleanedTrashpointMap.png';
import activeInToxicTP from '../../../assets/trashpoints/icActiveInactiveToxicTrashpointMap.png';
import activeInTrashpointTP from '../../../assets/trashpoints/icActiveInactiveTrashpointMap.png';
import activeRegularTP from '../../../assets/trashpoints/icActiveRegularTrashpointMap.png';
import activeToxicTP from '../../../assets/trashpoints/icActiveToxicTrashpointMap.png';
import inactiveCleanedTP from '../../../assets/trashpoints/icInactiveCleanedTrashpointMap.png';
import inactiveInToxicTP from '../../../assets/trashpoints/icInactiveInactiveToxicTrashpointMap.png';
import inactiveInTrashpointTP from '../../../assets/trashpoints/icInactiveInactiveTrashpointMap.png';
import inactiveRegularTP from '../../../assets/trashpoints/icInactiveRegularTrashpointMap.png';
import inactiveToxicTP from '../../../assets/trashpoints/icInactiveToxicTrashpointMap.png';
import clusterIcon from '../../../assets/trashpoints/cluster.png';

import regular from '../../../assets/trashpoint_icons/icRegularTrashpoint@2x.png';
import threat from '../../../assets/trashpoint_icons/icToxicTrashpoint@2x.png';
import cleaned from '../../../assets/trashpoint_icons/icCleanedTrashpoint@2x.png';
import outdated from '../../../assets/trashpoint_icons/icRegularTrashpointInactive@2x.png';

export const BinIcon = () => <img src={bin} alt="bin-icon" />;
export const RubbishIcon = () => <img src={rubbish} alt="rub-icon" />;
export const RubbishIconActive = () => <img src={rubbishActive} alt="rub-icon" />;
export const ArrowDownIcon = () => <img src={arrowDown} alt="arrowdown-icon" />;
export const EventsIcon = () => <img src={events} alt="events-icon" />;
export const LocationIcon = () => <img src={location} alt="location-icon" />;
export const LocationIconEvent = () => <img src={locationBlue} alt="location-icon-ev" />;
export const LocationPinActive = () => <img src={locationPinActive} alt="location-pin-a" />;
export const LocationPinInactive = () => <img src={locationPinActive} alt="location-pin-ina" />;
export const LocationIcon24px = () => <img src={locationBlack24px} alt="location-icon-black" />;
export const GroupIcon24px = () => <img src={groupBlack24px} alt="group-icon-black" />;
export const MinimizeIcon = () => <img src={hidePanel} alt="minimize-icon" />;
export const FbIcon = () => <img src={fb} alt="fb-icon" />;
export const HumanIcon = () => <img src={human} alt="human" />;
export const GoogleIcon = () => <img src={google} alt="google-icon" />;
export const ShareIcon = () => <img src={share} alt="share-icon" />;
export const ParticipantsIcon = () => <img src={participants} alt="participants-icon" />;
export const ReportIcon = () => <img src={report} alt="report-icon" />;
export const CloseIcon = () => <img src={close} alt="close-icon" />;
export const DateIcon = () => <img src={date} alt="date-icon" />;
export const Userpic = () => (<img
  src={userpicHolder}
  alt="userpic"
/>);
export const SearchIcon = () => <img src={search} alt="search" />;
export const UsersIcon = () => <img src={users} alt="users" />
export const EmailIcon = () => <img src={email} alt="email" />;
export const PhoneIcon = () => <img src={phone} alt="phone" />;
export const BackIcon = () => <img src={back} alt="back" />;
export const CollapseIcon = () => <img src={collapse} alt="collapse" />;
export const ExpandIcon = () => <img src={expand} alt="expand" />;
export const TimeIcon = () => <img src={time} alt="time" />;
export const LogoutIcon = () => <img src={logout} alt="logout" />;

export const TrashpointPins = {
  activeRegularTp: activeRegularTP,
  inactiveRegularTp: inactiveRegularTP,
  activeInRegularTp: activeInTrashpointTP,
  inactiveInRegularTp: inactiveInTrashpointTP,
  activeToxicTp: activeToxicTP,
  inactiveToxicTp: inactiveToxicTP,
  activeCleanedTp: activeCleanedTP,
  inactiveCleanedTp: inactiveCleanedTP,
  activeInToxicTp: activeInToxicTP,
  inactiveInToxicTp: inactiveInToxicTP,
};

export const TrashpointIcons = {
  regular,
  threat,
  cleaned,
  outdated,
};

export {
  locationPinActive,
  locationPinInactive,
  clusterIcon,
  userpicHolder,
  eventCover,
  eventCoverBig,
  noEventsCover,
  noUsersCover,
  expandArea,
  errorImg,
};
