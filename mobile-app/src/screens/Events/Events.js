import React, {Component} from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    TouchableHighlight,
    Button,
    Image
} from 'react-native';
import styles from './styles'
import {
    CREATE_EVENT,
} from "../index";
import {connect} from "react-redux";
import strings from '../../assets/strings'
import FAB from 'react-native-fab'
import Icon from 'react-native-vector-icons/Feather';

import EventsList from "./List/List"

const filterId = 'filterId';
const searchId = 'searchId';

class Events extends Component {

    static navigatorStyle = {
        navBarCustomView: "EVENTS_NAV_BAR",
        statusBarColor: 'white',
        statusBarTextColorScheme: 'dark',
        navBarBackgroundColor: 'white',
        navBarCustomViewInitialProps: {
            handleIndexChange: (index) => {

            }
        }
    };

    static navigatorButtons = {
        leftButtons: [
            {
                icon: require('../../../src/assets/images/icFilter.png'),
                id: filterId,
            }
        ],
        rightButtons: [
            {
                icon: require('../../../src/assets/images/icSearchBlack24Px.png'),
                id: searchId,
            }
        ]

    };

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            switch (event.id) {
                case filterId: {

                    break;
                }
                case searchId: {

                    break;
                }
            }
        }
    }

    handleFabPress = () => {
        this.props.navigator.push({
            screen: CREATE_EVENT,
            title: strings.label_create_events_step_one
        });
    };
    componentWillReceiveProps(nextProps) {
        const events = nextProps.events.get('events');

        if (events) {
            console.log("WIN");
            console.log(events.length);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <EventsList
                    dispatch={this.props.dispatch}
                    app={this.props.app}
                    events={this.props.events}
                    style={{
                        width: '100%',
                        height: '100%',
                        flex: 1,
                    }}
                />
                    <FAB
                        buttonColor="rgb(225, 18, 131)"
                        iconTextColor="white"
                        onClickAction={this.handleFabPress}
                        visible={true}
                        iconTextComponent={<Icon name="plus"/>}/>
            </View>
        );
    }

}

const mapStateToProps = (state) => ({
    events: state.get('events'),
    app: state.get('app'),
});

export default connect(mapStateToProps)(Events)