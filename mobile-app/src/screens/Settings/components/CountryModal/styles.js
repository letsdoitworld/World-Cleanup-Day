import EStyleSheet from 'react-native-extended-stylesheet';
import {StyleSheet} from 'react-native';
import {getHeightPercentage} from '../../../../shared/helpers';

export default EStyleSheet.create({
    inputContainer: {
        marginTop: getHeightPercentage(20),
        paddingHorizontal: 5,
    },
    listContainer: {
        marginTop: getHeightPercentage(5),
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        // height: getHeightPercentage(25),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#bbb',
        justifyContent: 'center',
    },
    itemText: {
        fontSize: 16,
        fontFamily: '$font',
        margin: 10,
        // textAlign: 'center',
    },
    viewStyle: {
        flex: 1
    }
});
