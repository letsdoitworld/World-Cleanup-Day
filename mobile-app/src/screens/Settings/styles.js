import EStyleSheet from 'react-native-extended-stylesheet';

import {getWidthPercentage, getHeightPercentage} from '../../shared/helpers';
import colors from "../../config/colors";

export default {
    listContainer: {
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        backgroundColor: colors.$mainBackground
    },
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

    titleStyle: {
        height: getHeightPercentage(35),
        width: '100%',
        justifyContent: 'center'
    },
    titleTextStyle: {
        marginStart: getWidthPercentage(10),
        fontSize: 13,
        color: colors.$textColorDivider
    },
    itemStyle: {
        marginTop: 1,
        height: getHeightPercentage(35),
        width: '100%',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: colors.$white,

    },
    lastItemStyle: {
        marginTop: 1,
        height: getHeightPercentage(35),
        width: '100%',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: colors.$white,
        flexGrow: 1,
    },
    imageItemStyle: {
        flex: 1,
        height: 24,
        width: 24,
        marginLeft: getWidthPercentage(10),
        alignSelf: 'center'
    },
    textItemStyle: {
        flex: 9,
        marginLeft: getWidthPercentage(10),
        fontSize: 17,
        color: colors.$textColorSettings,
        alignSelf: 'center'
    },
    logoutButtonStyle: {
        position: 'absolute',
        borderRadius: 10,
        bottom: '3%',
        height: getHeightPercentage(35),
        width: '90%',
        backgroundColor: colors.$accentPink,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    logOutTextStyle: {
        fontSize: 17,
        color: colors.$white,
        alignSelf: 'center'
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
