import React from "react";
import { Image } from "react-native";
import PropTypes from "prop-types";

const Logo = ({ style }) => {
  return (
    <Image
      resizeMode="contain"
      style={style}
      source={require("./images/logo.png")}
    />
  );
};
Logo.propTypes = {
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.arrayOf
  ])
};
export default Logo;
