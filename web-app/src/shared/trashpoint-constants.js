import bagfullBlueFill from '../components/TrashpointDetails/images/icon_bagful_blue_fill@2x.png';
import bagfullBlueOutline from '../components/TrashpointDetails/images/icon_bagful_blue_outline@2x.png';
import bagfullGreyFill from '../components/TrashpointDetails/images/icon_bagful_grey_fill@2x.png';
import bagfullGreyOutline from '../components/TrashpointDetails/images/icon_bagful_grey_outline@2x.png';
import cartloadBlueFill from '../components/TrashpointDetails/images/icon_cartload_blue_fill@2x.png';
import cartloadBlueOutline from '../components/TrashpointDetails/images/icon_cartload_blue_outline@2x.png';
import cartloadGreyFill from '../components/TrashpointDetails/images/icon_cartload_grey_fill@2x.png';
import cartloadGreyOutline from '../components/TrashpointDetails/images/icon_cartload_grey_outline@2x.png';
import handfulBlueFill from '../components/TrashpointDetails/images/icon_handful_blue_fill@2x.png';
import handfulBlueOutline from '../components/TrashpointDetails/images/icon_handful_blue_outline@2x.png';
import handfulGreyFill from '../components/TrashpointDetails/images/icon_handful_grey_fill@2x.png';
import handfulGreyOutline from '../components/TrashpointDetails/images/icon_handful_grey_outline@2x.png';
import truckBlueFill from '../components/TrashpointDetails/images/icon_truck_blue_fill@2x.png';
import truckBlueOutline from '../components/TrashpointDetails/images/icon_truck_blue_outline@2x.png';
import truckGreyFill from '../components/TrashpointDetails/images/icon_truck_grey_fill@2x.png';
import truckGreyOutline from '../components/TrashpointDetails/images/icon_truck_grey_outline@2x.png';

export const STATUS_COUNT_HASH = {
  threat: {
    label: 'THREAT',
    color: '#FC505E',
    background: 'linear-gradient(180deg, #FE6669 0%, #FC505E 100%)',
    borderColor: '#E93A47',
  },
  regular: {
    label: 'REGULAR',
    color: '#FF7800',
    background: 'linear-gradient(180deg, #FF9900 0%, #FF7800 100%)',
    borderColor: '#EE7200',
  },
  cleaned: {
    label: 'CLEANED',
    color: '#5DBA37',
    background: 'linear-gradient(180deg, #7BEA4E 0%, #5DBA37 100%)',
    borderColor: '#57B531',
  },
  outdated: {
    label: 'OUTDATED',
    color: '#E3E3E3',
    background: 'linear-gradient(180deg, #E3E3E3 0%, #C3C3C3 100%)',
    borderColor: '#ABABAB',
  },
};

export const AMOUNT_PICKER_IMAGES = {
  BAGFUL_BLUE_FILL: {
    source: bagfullBlueFill,
    style: { width: '20px' },
  },
  BAGFUL_BLUE_OUTLINE: {
    source: bagfullBlueOutline,
    style: { width: '20px' },
  },
  BAGFUL_GREY_FILL: {
    source: bagfullGreyFill,
    style: { width: '20px' },
  },
  BAGFUL_GREY_OUTLINE: {
    source: bagfullGreyOutline,
    style: { width: '20px' },
  },
  HANDFUL_BLUE_FILL: {
    source: handfulBlueFill,
    style: { width: '28px' },
  },
  HANDFUL_BLUE_OUTLINE: {
    source: handfulBlueOutline,
    style: { width: '28px' },
  },
  HANDFUL_GREY_FILL: {
    source: handfulGreyFill,
    style: { width: '28px' },
  },
  HANDFUL_GREY_OUTLINE: {
    source: handfulGreyOutline,
    style: { width: '28px' },
  },
  CARTLOAD_BLUE_FILL: {
    source: cartloadBlueFill,
    style: { width: '28px' },
  },
  CARTLOAD_BLUE_OUTLINE: {
    source: cartloadBlueOutline,
    style: { width: '28px' },
  },
  CARTLOAD_GREY_FILL: {
    source: cartloadGreyFill,
    style: { width: '28px' },
  },
  CARTLOAD_GREY_OUTLINE: {
    source: cartloadGreyOutline,
    style: { width: '28px' },
  },
  TRUCK_BLUE_FILL: {
    source: truckBlueFill,
    style: { width: '33px' },
  },
  TRUCK_BLUE_OUTLINE: {
    source: truckBlueOutline,
    style: { width: '33px' },
  },
  TRUCK_GREY_FILL: {
    source: truckGreyFill,
    style: { width: '33px' },
  },
  TRUCK_GREY_OUTLINE: {
    source: truckGreyOutline,
    style: { width: '33px' },
  },
};

export const TOGGLE_TYPE = {
  handful: 'HANDFUL',
  bagful: 'BAGFUL',
  cartload: 'CARTLOAD',
  truck: 'TRUCK',
};
