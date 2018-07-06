import React from 'react';
import { If } from 'react-if';
import FlagIcon from 'react-flag-kit/lib/FlagIcon';
import PropTypes from 'prop-types';

const UserAreas = ({ areas, onClick }) => {
  const defineFlagCode = area => {
    let areaId;
    const arrayOfIds = ["AD","AE","AF","AG","AI","AL","AM","AO","AR","AS","AT","AU","AW","AX","AZ","BA","BB","BD","BE","BF","BG","BH","BI","BJ","BL","BM","BN","BO","BR","BS","BT","BV","BW","BY","BZ","CA","CC","CD","CF","CG","CH","CI","CK","CL","CM","CN","CO","CR","CU","CV","CW","CX","CY","CZ","DE","DJ","DK","DM","DO","DZ","EC","EE","EG","ER","ES","ET","EU","FI","FJ","FK","FM","FO","FR","GA","GB","GB-ENG","GB-NIR","GB-SCT","GB-WLS","GB-ZET","GD","GE","GF","GG","GH","GI","GL","GM","GN","GP","GQ","GR","GS","GT","GU","GW","GY","HK","HM","HN","HR","HT","HU","ID","IE","IL","IM","IN","IO","IQ","IR","IS","IT","JE","JM","JO","JP","KE","KG","KH","KI","KM","KN","KP","KR","KW","KY","KZ","LA","LB","LC","LGBT","LI","LK","LR","LS","LT","LU","LV","LY","MA","MC","MD","ME","MG","MH","MK","ML","MM","MN","MO","MP","MQ","MR","MS","MT","MU","MV","MW","MX","MY","MZ","NA","NC","NE","NF","NG","NI","NL","NO","NP","NR","NU","NZ","OM","PA","PE","PF","PG","PH","PK","PL","PM","PN","PR","PS","PT","PW","PY","QA","RE","RO","RS","RU","RW","SA","SAMI","SB","SC","SD","SE","SE-JAM","SE-SKA","SE-VAS","SEFI","SG","SI","SJ","SK","SL","SM","SN","SO","SR","SS","ST","SV","SX","SY","SZ","TC","TD","TF","TG","TH","TJ","TK","TL","TM","TN","TO","TORN","TR","TT","TV","TW","TZ","UA","UG","UM","US","US-CA","UY","UZ","VA","VC","VE","VG","VI","VN","VU","WF","WS","WW","WW-AFR","WW-ASI","WW-AUS","WW-EUR","WW-NAM","WW-SAM","XK","YE","YT","ZA","ZM","ZW"];
    if (arrayOfIds.indexOf(area.id) === -1) {
      areaId = 'WW';
    } else {
      areaId = area.id;
    }
    return areaId;
  };

  return (
    <div className="UserAreas-container">
      {areas.map((a) => (
        <div
          className="UserAreas-item"
          key={a.id}
        >
          <FlagIcon
            size={40}
            code={defineFlagCode(a)}
          />
          <div className="UserAreas-name-block">
            <span className="UserAreas-name">{a.name}</span>
          </div>
          <If condition={!!onClick}>
            <div>
              <span
                className="UserAreas-remove"
                onClick={() => onClick(a)}
              >
                Remove
              </span>
            </div>
          </If>
        </div>
      ))}
    </div>
  );
};

UserAreas.propTypes = {
  areas: PropTypes.any,
  onClick: PropTypes.func,
};

UserAreas.defaultProps = {
  areas: [],
  onClick: null,
};

export default UserAreas;
