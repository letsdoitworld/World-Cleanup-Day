import React from 'react';
import {
  View,
  ActivityIndicator,
  FlatList,
  Image,
  Text,
} from 'react-native';
import isEmpty from 'lodash/isEmpty';
import ImmutableComponent from '../../../components/InputFields/ImmutableComponent';
import { Backgrounds } from '../../../assets/images';

import styles from './styles';
import ListItem from './ListItem/ListItem';


export default class EventsList extends ImmutableComponent {
  page = 0;

  handleLoadMore = () => {
    if (this.getEventsListLength() < this.props.pageSize * (this.page + 1)) {
      return;
    }
    this.page = this.page + 1;

    this.props.onPageChanged(this.page);
  };
  offset= 0;
  onScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    let direction = currentOffset > this.offset ? 'down' : 'up';
    if (currentOffset <= 0) direction = 'up';
    this.offset = currentOffset;
    if (direction === 'down') {
      this.props.changeVisible(false);
    } else this.props.changeVisible(true);
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  getEventsFromProps() {
    return this.props.events;
  }

  render() {
    return isEmpty(this.props.events)
      ? (
        <View style={styles.emptyView}>
          <Image style={styles.emptyImage} source={Backgrounds.EmptyTrashpoints} />
          <Text style={styles.text}>Nothing to see here!</Text>
          <Text style={styles.textGrey}>
            Widen the search area or try another filter.
          </Text>
        </View>
      )
      : (
        <FlatList
          onMomentumScrollEnd={() => this.props.changeVisible(true)}
          onScroll={this.onScroll}
          ListFooterComponent={this.renderFooter}
          ListHeaderComponent={this.renderHeader}
          style={styles.list}
          ItemSeparatorComponent={this.renderSeparator}
          data={this.getEventsFromProps()}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          onEndReached={this.handleLoadMore}
          refreshing={this.isProgressEnabled()}
          onRefresh={this.onRefresh}
        />
      );
  }

  onRefresh = () => {
    this.page = 0;
    this.props.onPageChanged(this.page);
  }

  isProgressEnabled() {
    return this.props.isLoading;
  }

  renderSeparator = () => {
    return (
      <View style={styles.listDivider} />
    );
  };

  getEventsListLength() {
    return this.getEventsFromProps() ? this.getEventsFromProps().length : 0;
  }

  isEventsListEmpty() {
    return this.getEventsFromProps() ? this.getEventsFromProps().length === 0 : true;
  }

  renderFooter = () => {
    if (this.isProgressEnabled() && this.page === 0 || this.isEventsListEmpty()) {
      return null;
    } else if (this.isProgressEnabled() && this.page > 0) {
      return (
        <View
          style={styles.paginationFooter}
        >
          {this.spinner()}
        </View>
      );
    }
    return <View style={styles.listDivider} />;
  };

  renderHeader = () => {
    if (this.isProgressEnabled() && this.page === 0 || this.isEventsListEmpty()) {
      return null;
    }
    return <View style={styles.listDivider} />;
  };

  keyExtractor = item => item.id.toString();

  renderItem = ({ item }) => {
    return (
      <ListItem
        navigator={this.props.navigator}
        item={item}
        onEventDeleted={this.props.onEventDeleted}
        id={item.id}
        imageIndex={this.props.emptyEvents.indexOf(item) !== -1
          ? this.props.emptyEvents.indexOf(item) % 3
          : null}
      />
    );
  };

  spinner() {
    return (
      <ActivityIndicator
        style={styles.spinner}
        size="large"
        color="rgb(0, 143, 223)"
      />
    );
  }
}
