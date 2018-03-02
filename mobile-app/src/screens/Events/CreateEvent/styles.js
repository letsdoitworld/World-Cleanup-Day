import {getWidthPercentage, getHeightPercentage} from '../../../shared/helpers';
import colors from "../../../config/colors";

export default {
    container: {
        height: '100%',
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
        marginTop: 1,
        height: getHeightPercentage(35),
        width: '100%',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: colors.$white,

    },
}