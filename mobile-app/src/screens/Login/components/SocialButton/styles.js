import colors from '../../../../config/colors';
import {
  getHeightPercentage,
  getWidthPercentage,
} from '../../../../shared/helpers';

export default {
    $iconSize: 20,
    container: {
        backgroundColor: colors.$white,
        flexDirection: 'row',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 5,
        alignItems: 'center',
    },
    iconContainer: {
        flex: -1,
        borderRadius: 25,
        height: getHeightPercentage(25),
        width: getWidthPercentage(25),
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    icon: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
    },
}

