import React, { PureComponent } from 'react';
import {
  FlatList,
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import _ from 'lodash';

import { translate } from 'react-i18next';

import PropTypes from 'prop-types';

import {
  selectors as trashSels,
  operations as trashOps,
} from '../../reducers/trashpile';
import ActivityListItem from './components/ActivityListItem';
import { Divider } from '../../components/Divider';
import { EmptyStateScreen } from '../../components/EmptyStateScreen';
import { SimpleButton } from '../../components/Buttons';

import styles from './styles';

const divider = () => <Divider hasTopLine={false} />;

class MyActivity extends PureComponent {
  goToDetails = _.debounce(
    ({ id, location }) => {
      this.props.navigation.navigate('Details', {
        markerId: id,
        latlng: location,
      });
    },
    1000,
    {
      leading: true,
      trailing: false,
    },
  );

  componentWillMount = () => {};

  _renderItem = ({ item }) =>
    <ActivityListItem {...item} onPressItem={this.goToDetails} />;

  _keyExtractor = ({ id }) => id;

  displayEmptyState = () => {
    return (
      <View style={styles.emptyStateScreenContainer}>
        <EmptyStateScreen description={this.props.t('label_text_activity_empty_text')} />
        <View style={styles.emptyStateScreenImageContainer}>
          <Text style={styles.emptyStateScreenText}>
            {this.props.t('label_text_activity_empty_hint')}
          </Text>
          <Image source={require('./images/arrow.png')} />
        </View>
      </View>
    );
  };

  displayLoading = () => {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  };
  displayRetry = () => {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <SimpleButton text={this.props.t('label_retry_button')} onPress={this.loadMoreTrashpiles} />
      </View>
    );
  };

  handleRefresh = () => {
    const { fetchUserTrashpoints } = this.props;
    fetchUserTrashpoints({ reset: true });
  };

  loadMoreTrashpiles = () => {
    const { fetchUserTrashpoints, canLoadMore, loading } = this.props;
    if (canLoadMore && !loading) {
      fetchUserTrashpoints();
    }
  };
  displayFlatList = () => {
    const { loading, trashpiles, error, initialLoad, refreshing } = this.props;
    return (
      <FlatList
        data={trashpiles}
        ListEmptyComponent={this.displayEmptyState}
        initialNumToRender={10}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        onEndReached={this.loadMoreTrashpiles}
        onEndReachedThreshold={0.3}
        ItemSeparatorComponent={divider}
        ListFooterComponent={divider}
        onRefresh={this.handleRefresh}
        refreshing={refreshing && !initialLoad}
      />
    );
  };

  render() {
    const { loading, error, initialLoad, refreshing } = this.props;

    if (!initialLoad && error) {
      return this.displayRetry();
    }

    if (!initialLoad && loading && !refreshing) {
      return this.displayLoading();
    }

    return this.displayFlatList();
  }
}

MyActivity.propTypes = {
  trashpiles: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  initialLoad: PropTypes.bool.isRequired,
  canLoadMore: PropTypes.bool.isRequired,
  refreshing: PropTypes.bool.isRequired,
  fetchUserTrashpoints: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  trashpiles: trashSels.userTrashpoints(state),
  loading: trashSels.userTrashpointsLoading(state),
  error: trashSels.userTrashpointsError(state),
  initialLoad: trashSels.userTrashpointsInitialLoaded(state),
  canLoadMore: trashSels.userTrashpointsCanLoadMore(state),
  refreshing: trashSels.userTrashpointsRefreshing(state),
});
const mapDispatch = {
  fetchUserTrashpoints: trashOps.fetchUserTrashpoints,
};

export default compose(connect(mapStateToProps, mapDispatch), translate())(
  MyActivity,
);
