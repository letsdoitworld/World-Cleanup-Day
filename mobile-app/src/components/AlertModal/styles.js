import EStyleSheet from 'react-native-extended-stylesheet';
import {getHeightPercentage, getWidthPercentage} from '../../shared/helpers';
import dimens from "../../config/dimens";

export default EStyleSheet.create({
    noButtonsContainer: {
        height: getHeightPercentage(170),
        paddingBottom: getHeightPercentage(20),
    },
    image: {
        marginTop: getHeightPercentage(20),
        width: getWidthPercentage(50),
        height: getHeightPercentage(50),
    },
    header: {
        marginTop: getHeightPercentage(15),
        color: 'rgba(43,43,43,0.98)',
        fontFamily: 'Lato-Bold',
        fontSize: 20,
    },
    subHeader: {
        marginTop: getHeightPercentage(5),
        paddingHorizontal: getWidthPercentage(20),
        fontFamily: 'Lato-Bold',
        color: 'rgba(43,43,43,0.98)',
        fontSize: 15,
        textAlign: 'center',
    },
    buttonsContainer: {
        flexDirection: 'column',
        flex: 1,
        paddingVertical: dimens.margin_small
    },
    mainContainer: {
        backgroundColor: 'white',
        position: 'absolute',
        top: 178,
        left: 20,
        right: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    fullSize: {
        flex: 1
    },
    background: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        flex: 1,
    }
});
