import React, { PureComponent } from 'react';
import {
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import strings from '../../assets/strings';

import styles from './styles';

class ReadMore extends PureComponent {
  state = {
    measured: false,
    shouldShowReadMore: false,
    showAllText: false,
  }

  async componentDidMount() {
    await nextFrameAsync();

    const fullHeight = await measureHeightAsync(this.text);
    this.setState({ measured: true });
    await nextFrameAsync();

    const limitedHeight = await measureHeightAsync(this.text);

    if (fullHeight > limitedHeight) {
      this.setState({ shouldShowReadMore: true }, () => {
        this.props.onReady && this.props.onReady();
      });
    }
  }

  handlePressReadMore = () => {
    this.setState({ showAllText: true });
  }

  handlePressReadLess = () => {
    this.setState({ showAllText: false });
  }

  maybeRenderReadMore() {
    const {
      shouldShowReadMore,
      showAllText,
    } = this.state;

    const {
      renderTruncatedFooter,
      renderRevealedFooter,
    } = this.props;

    if (shouldShowReadMore && !showAllText) {
      if (renderTruncatedFooter) {
        return renderTruncatedFooter(this.handlePressReadMore);
      }

      return (
        <Text style={styles.button} onPress={this.handlePressReadMore}>
          {strings.label_read_more}
        </Text>
      );
    } else if (shouldShowReadMore && showAllText) {
      if (renderRevealedFooter) {
        return renderRevealedFooter(this.handlePressReadLess);
      }

      return (
        <Text style={styles.button} onPress={this.handlePressReadLess}>
          {strings.label_hide}
        </Text>
      );
    }
  }

  render() {
    const {
      measured,
      showAllText,
    } = this.state;

    const {
      numberOfLines,
      style,
      children,
    } = this.props;

    return (
      <View style={style}>
        <Text
          numberOfLines={measured && !showAllText ? numberOfLines : 0}
          ref={(text) => { this.text = text; }}
        >
          {children}
        </Text>

        {this.maybeRenderReadMore()}
      </View>
    );
  }
}

function measureHeightAsync(component) {
  return new Promise((resolve) => {
    component.measure((x, y, w, h) => {
      resolve(h);
    });
  });
}

function nextFrameAsync() {
  return new Promise(resolve => requestAnimationFrame(() => resolve()));
}

ReadMore.propTypes = {
  numberOfLines: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.styles]),
  children: PropTypes.node,
  renderTruncatedFooter: PropTypes.func,
  renderRevealedFooter: PropTypes.func,
};


export { ReadMore };
