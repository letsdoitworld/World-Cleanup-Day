import {getWidthPercentage, getHeightPercentage} from '../../../shared/helpers';
import colors from "../../../config/colors";

export default {
    container: {
        width: '100%',
        flexDirection: "column",
        backgroundColor: colors.$mainBackground
    },
    titleStyle: {
        height: getHeightPercentage(35),
        width: '100%',
        justifyContent: 'center'
    },
    titleTextStyle: {
        marginStart: getWidthPercentage(10),
        fontSize: 13,
        color: colors.$textColorDivider,
        fontFamily: 'Lato-Bold'
    },
    itemStyle: {
        height: getHeightPercentage(35),
        width: '100%',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: colors.$white,
    },
    inputContainerStyle: {
        height: getHeightPercentage(35),
        width: '100%',
        backgroundColor: colors.$white,
    },
    inputTextStyle: {
        width: '100%',
        marginStart: getWidthPercentage(10),
        alignSelf: 'center',
        fontSize: 17,
        fontFamily: 'Lato-Regular'
    },
    dateAndTimeContainerStyle: {
        width: '90%',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    imageContainer: {
        height: getHeightPercentage(35),
        marginLeft: getWidthPercentage(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageItemStyle: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    dateAndTimeRowStyle: {
        height: getHeightPercentage(35),
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
    },
    dateTextStyle: {
        flex: 1,
        fontSize: 17,
        marginRight: getWidthPercentage(10),
        fontFamily: 'Lato-Regular',
        color: colors.$blackTransparent,
        alignSelf: 'center',
    },
    dateTitleTextStyle: {
        marginLeft: getWidthPercentage(10),
        flex: 2,
        color: colors.$black,
        alignSelf: 'center',
        fontSize: 17,
        fontFamily: 'Lato-Regular'
    },
    dateContainer: {
        height: getHeightPercentage(70),
        width: '100%',
        flexDirection: 'row',
        backgroundColor: colors.$white,
    },
    dividerStyle: {
        width: '100%',
        height: 1,
        marginLeft: getWidthPercentage(10),
        backgroundColor: colors.$dividerColor
    },
    trashpointTipStyle: {
        backgroundColor: colors.$deepGreyTransparent,
        height: getHeightPercentage(35),
        width: '100%',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    imageTrashStyle: {
        width: 24,
        height: 24,
        marginLeft: getWidthPercentage(10),
        alignSelf: 'center',
        left: 0,
        resizeMode: 'contain'
    },
    textTrashStyle: {
        flex: 1,
        fontSize: 17,
        marginLeft: getWidthPercentage(10),
        color: colors.$blackTransparent,
        alignSelf: 'center',
        fontFamily: 'Lato-Regular'
    },
    locationContainerStyle: {
        backgroundColor: colors.$white,
        height: getHeightPercentage(35),
        width: '100%',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    descriptionContainerStyle: {
        height: getHeightPercentage(65),
        width: '100%',
        backgroundColor: colors.$white,
    },
    eventPhotoContainerStyle: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 235,
        width: '100%',
        backgroundColor: colors.$transparentBlueColor
    }
}