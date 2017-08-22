import EStyleSheet from 'react-native-extended-stylesheet';

import { getHeightPercentage, getWidthPercentage } from '../../shared/helpers';

export default EStyleSheet.create({
    termsView: {
        width: getWidthPercentage(320),
        height: getHeightPercentage(430),
        backgroundColor: 'transparent',
    },
});
