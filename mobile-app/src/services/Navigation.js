import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { wrapDisplayName } from 'recompose';

const debounceMethod = (method) => {
  return _.debounce(method, 2000, {
    leading: true,
    trailing: false,
  });
};

const extendWithDebounce = (navigation) => {
  return {
    ...navigation,
    navigate: debounceMethod(navigation.navigate),
    goBack: debounceMethod(navigation.goBack),
    dispatch: debounceMethod(navigation.dispatch),
    setParams: debounceMethod(navigation.setParams),
  };
};

export const withNavigationHelpers = () => (Component) => {
  return class extends React.Component {
    static propTypes = {
      navigation: PropTypes.object.isRequired,
    };
    constructor(props) {
      super(props);
      this.state = {
        extendedNavigation: extendWithDebounce(props.navigation),
      };

      this.displayName = wrapDisplayName(Component, 'withNavigationHelpers');
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.navigation !== this.props.navigation) {
        this.setState({
          extendedNavigation: extendWithDebounce(nextProps.navigation),
        });
      }
    }

    render() {
      const { props } = this;
      const { extendedNavigation } = this.state;
      return <Component {...props} navigation={extendedNavigation} />;
    }
  };
};
