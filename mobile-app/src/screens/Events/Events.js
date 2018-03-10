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
import strings from '../../assets/strings'
import FAB from 'react-native-fab'
import Icon from 'react-native-vector-icons/Feather';

const filterId = 'filterId';
const searchId = 'searchId';


export default class Events extends Component {

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

    render() {
        return (
            <View>
                <View style={styles.container}>
                    <FAB
                        buttonColor="rgb(225, 18, 131)"
                        iconTextColor="white"
                        onClickAction={this.handleFabPress}
                        visible={true}
                        iconTextComponent={<Icon name="plus"/>}
                    />
                </View>
            </View>);
    }

}