import EStyleSheet from 'react-native-extended-stylesheet';

import {getHeightPercentage, getWidthPercentage} from '../../shared/helpers';

export default EStyleSheet.create({
    $textColor:'#7d7d7d',
    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    creationImage: {
        height: getHeightPercentage(9),
        marginLeft: getWidthPercentage(3),
    },
    updateImage: {
        height: getHeightPercentage(12),
        marginLeft: getWidthPercentage(3),
    },
    createdText: {
        fontFamily: '$font',
        fontSize: '$fontDefaultSize',
        color: '$textColor',
        paddingLeft: getWidthPercentage(7),
        width: getWidthPercentage(60)
    },
    updatedText: {
        fontFamily: '$font',
        fontSize: '$fontDefaultSize',
        color: '$textColor',
        paddingLeft: getWidthPercentage(6),
        width: getWidthPercentage(60)
    },
    dateText: {
        color: '$textColor',
        fontFamily: '$font',
        fontSize: '$fontDefaultSize',
    },
});