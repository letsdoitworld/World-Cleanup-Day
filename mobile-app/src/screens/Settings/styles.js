import EStyleSheet from 'react-native-extended-stylesheet';

import {getWidthPercentage, getHeightPercentage} from '../../shared/helpers';
import colors from "../../config/colors";

export default {
    listContainer: {},
    separator: {
        marginTop: getHeightPercentage(20),
    },
    list: {
        backgroundColor: 'white',
        // paddingLeft: getWidthPercentage(20),
    },
    listItem: {
        paddingTop: 13,
        paddingBottom: 13,
        borderWidth: 0,
    },
    title: {
        fontFamily: '$font',
        fontSize: 15,
        color: 'black',
    },
    subtitle: {
        fontFamily: '$boldFont',
        fontSize: 15,
        color: 'black',
    },
    logout: {
        color: '#3E8EDE',
    },
    chevron: {
        marginTop: 20,
        marginBottom: 0,
        fontSize: 20,
    },
    dividerStyle: {
        height: getHeightPercentage(30),
        width: '100%',
        backgroundColor: colors.$mainBackground,
        justifyContent: 'center'
    },
    dividerTextStyle: {
        marginStart: getWidthPercentage(10),
        fontSize: 13,
        color: colors.$textColorSettings
    },
    itemStyle: {
        height: getHeightPercentage(30),
        width: '100%',
        justifyContent: 'center',
        flexDirection: 'row'
    }
}
export const rightIcon = {
    name: 'chevron-right',
    type: 'entypo',
};
export const listItemProps = {
    containerStyle: {
        paddingTop: 13,
        paddingBottom: 13,
    },
    chevronColor: '#3E8EDE',
    //titleStyle: styles.title,
    subtitleStyle: {
        fontFamily: 'noto-sans-bold',
        fontSize: 15,
        color: 'black',
    },
    underlayColor: 'rgba(255,255,255,0.3)',
    rightIcon,
};
