import React, { PureComponent } from 'react';
import { NavLink } from 'react-router-dom';
import { If, Else } from 'react-if';
import PropTypes from 'prop-types';
import { Event } from '../Event';
import { EmptyEventsState } from '../EmptyState';
import { Loader } from '../../Spinner';

export class List extends PureComponent {
  state = {
    firstLoadPass: false,
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isLoading && !this.state.firstLoadPass) {
      this.setState({ firstLoadPass: true });
    }
  }

  render() {
    const { events, isLoading } = this.props;
    const showLoaderCondition = isLoading && !this.state.firstLoadPass;
    return (
      <div>
        <If condition={showLoaderCondition}>
          <Loader />
          <Else>
            <div>
              {
                events.length ?
                events.map(ev => {
                  return (
                    <NavLink key={ev.id} to={`/event/${ev.id}`}>
                      <Event
                        eventId={ev.id}
                        avatar={ev.photos[0]}
                        title={ev.name}
                        author={ev.createdByName}
                        date={ev.startTime}
                        location={ev.address}
                        attendeesAmount={ev.attendeesAmount}
                        maxNumberOfAttendees={ev.maxPeopleAmount}
                      />
                    </NavLink>
                  );
                },
                ) :
                <EmptyEventsState text={'Nothing to see here!'} subheadNeeded />
              }
            </div>
          </Else>
        </If>
      </div>
    );
  }
}

List.propTypes = {
  events: PropTypes.any,
  isLoading: PropTypes.bool.isRequired,
};

List.defaultProps = {
  events: null,
};
