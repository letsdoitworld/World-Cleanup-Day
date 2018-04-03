import {Dimensions, StyleSheet} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {getHeightPercentage, getWidthPercentage} from '../../shared/helpers';
import dimens from "../../config/dimens";

export default EStyleSheet.create({
    $headerTopMargin: '$statusBarHeight',
    bottomContainer: {
        height: 75,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    createButton: {
        alignSelf: 'center',
        height: 75,
    },
    hashtagInput: {
     //   height: 35,
    //    width: getWidthPercentage(280),
     //   borderRadius: getWidthPercentage(17),
    //    paddingLeft: 20,
     //   backgroundColor: '#FFFFFF',

        textAlign: 'left',
        fontFamily: 'Lato-Regular',
        fontSize: 17,
        lineHeight: 24,
        color: 'rgb(40, 38, 51)',
        letterSpacing: 0.4,
        marginLeft: 16,
        flex: 1
    },
    hashtagInputPlaceholder: {
        color: '#7D7D7D',
        // fontFamily: 'noto-sans-regular',
       // fontSize: 13,
        textAlign: 'left',
        fontFamily: 'Lato-Regular',
        fontSize: 17,
        lineHeight: 24,
        letterSpacing: 0.4,
        marginLeft: 16
    },
    trashtypesText: {
        // fontFamily: 'noto-sans-bold',
        fontSize: 16,
    },
    inputContainer: {
        flex: 1,
        marginTop: getHeightPercentage(20),
        position: 'relative',
        height: getHeightPercentage(35),
    },
    tagsContainer: {
        paddingVertical: getWidthPercentage(20),
        paddingHorizontal: getHeightPercentage(20),
        flex: 1,
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#f6f6f6',
    },
    addTagGradient: {
        height: getHeightPercentage(35),
        width: getWidthPercentage(71),
        borderRadius: getWidthPercentage(52),
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: {width: 0, height: 0},
        shadowColor: 'black',
        shadowOpacity: 0.15,
    },
    addTagText: {
        color: '#3E8EDE',
        // fontFamily: 'noto-sans-bold',
        fontSize: 13,
        backgroundColor: 'transparent',
    },
    addTagTouchable: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'transparent',
    },
    addTagContainer: {
        backgroundColor: 'transparent',
    },
    addReportLinearGradient: {
        height: getHeightPercentage(35),
        width: getWidthPercentage(270),
        borderRadius: getWidthPercentage(17.5),
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: {width: 0, height: 0},
        shadowColor: 'black',
        shadowOpacity: 0.15,
    },
    notesText: {
        marginTop: getHeightPercentage(10),
        marginBottom: getHeightPercentage(10),
        fontSize: 13,
        color: '$textColor',
    },
    containerBtnNote: {
        paddingLeft: getWidthPercentage(5),
        paddingRight: getWidthPercentage(5),
    },
    amountText: {color: '#3E8EDE', fontSize: 13},
    modalBackground: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        flex: 1,
    },
    headerSection: {
        height: 38.5,
        flex: 1,
        backgroundColor: '#eeeeee',
        paddingLeft: 16,
        paddingTop: 16.5,
        color: 'rgb(126, 124, 132)',
        fontSize: 13,
        lineHeight: 14,
        letterSpacing: -0.1,
        textAlign: 'left',
        fontFamily: 'Lato-Bold'
    },
    confirmButton: {
        width: Dimensions.get('window').width - dimens.margin_medium * 2,
        marginHorizontal: dimens.margin_medium,
        marginBottom: dimens.margin_medium,
        backgroundColor: 'rgb(0, 143, 223)',
        height: 44,
        justifyContent: 'center',
        borderRadius: 4,
    },
    confirmButtonText: {
        alignSelf: 'center',
        color: 'white',
        fontFamily: 'Lato-Bold',
        fontSize: 17,
        lineHeight: 21,
    },
    addButton: {
        textAlign: 'left',
        color: 'rgb(0, 143, 223)',
        fontFamily: 'Lato-Bold',
        fontSize: 17,
        lineHeight: 24,
        letterSpacing: -0.4,
        marginRight: 16
    },
    spinner: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerContent: {
        flex: 1,
        justifyContent: 'center'
    },
    selectTrashPointTypeContainer: {
        height: 110,
        backgroundColor: 'rgb(216, 216, 216)',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    additionalTagsContainer: {
        height: 44,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    createTrashPointButtonContainer: {
        flex: 1,
        backgroundColor: '#eeeeee'
    },
    label: {
        textAlign: 'center',
        fontFamily: 'Lato-Bold',
        fontSize: 12,
        color: 'rgb(123, 125, 128)',
        letterSpacing: 0.4
    },
    scrollView: {
        backgroundColor: 'white'
    }
});
