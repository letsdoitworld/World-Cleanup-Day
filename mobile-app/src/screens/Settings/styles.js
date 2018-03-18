import {getWidthPercentage, getHeightPercentage} from '../../shared/helpers';
import colors from "../../config/colors";

export default {
    listContainer: {
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        backgroundColor: colors.$mainBackground
    },
    titleStyle: {
        height: getHeightPercentage(35),
        width: '100%',
        justifyContent: 'center'
    },
    titleTextStyle: {
        marginLeft: getWidthPercentage(10),
        fontSize: 13,
        color: colors.$textColorDivider,
        fontFamily: 'Lato-Bold'
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
        width: 24,
        height: 24,
        marginLeft: getWidthPercentage(10),
        alignSelf: 'center',
        left: 0,
        resizeMode: 'contain'
    },
    arrowItemStyle: {
        height: 13,
        width: 8,
        marginRight: getWidthPercentage(10),
        alignSelf: 'center',
        resizeMode: 'contain'
    },
    textItemStyle: {
        flex: 1,
        fontSize: 17,
        marginLeft: getWidthPercentage(10),
        color: colors.$textColorSettings,
        alignSelf: 'center',
        fontFamily: 'Lato-Regular'
    },
    textPrivateStyle: {
        flex: 1,
        fontSize: 17,
        marginLeft: getWidthPercentage(10),
        color: colors.$textColorSettings,
        alignSelf: 'center',
        fontFamily: 'Lato-Regular'
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
    },
    switchStyle: {
        width: 52,
        marginRight: getWidthPercentage(15),
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
        fontSize: 15,
        color: 'black',
    },
    underlayColor: 'rgba(255,255,255,0.3)',
    rightIcon,
};
