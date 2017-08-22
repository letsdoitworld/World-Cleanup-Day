import React from 'react';
import { View, Modal, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { wrapDisplayName } from 'recompose';
import invariant from 'invariant';

import LoadingModal from './LoadingModal';

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const withLoadingScreen = (
  selector,
  { compact = true } = {},
) => (Component) => {
  invariant(
    !!selector,
    'The selector function is required for the loading HOC',
  );

  const selectLoading = (props) => {
    return typeof selector === 'function' ? selector(props) : false;
  };

  return class extends React.Component {
    constructor(props) {
      super(props);

      const loading = selectLoading(props);

      this.state = {
        loading,
      };

      this.displayName = wrapDisplayName(Component, 'Loading');
    }

    componentWillReceiveProps(nextProps) {
      const loading = selectLoading(nextProps);
      if (this.state.loading !== loading) {
        this.setState({ loading });
      }

      if (loading && !this.timeoutID) {
        this.timeoutID = setTimeout(() => {
          this.setState(
            {
              loading: false,
            },
            () => {
              this.timeoutID = null;
            },
          );
        }, 3000);
      }
    }

    componentWillUnmount() {
      if (this.timeoutID) {
        clearTimeout(this.timeoutID);
      }
    }

    emptyFn = () => null;

    renderLoadingComponent = () => {
      if (compact) {
        return <ActivityIndicator />;
      }
      return <LoadingModal />;
    };

    render() {
      const { loading = false } = this.state;
      return (
        <View style={{ flex: 1 }}>
          <Modal
            animationType="fade"
            onRequestClose={this.emptyFn}
            transparent
            visible={loading}
          >
            <View style={styles.modalContainer}>
              {this.renderLoadingComponent()}
            </View>

          </Modal>
          <Component {...this.props} />
        </View>
      );
    }
  };
};
