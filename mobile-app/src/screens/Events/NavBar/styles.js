export default {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 2,
    width: 138,
    height: 28,
  },
  tabsContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: 34,
    height: 28,
    minHeight: 28,
    minWidth: 138,
    zIndex: 3,
    overflow: 'hidden',
  },
  tabTextStyle: {
    fontFamily: 'Lato-Bold',
    color: '#0082C0',
  },
  activeTabStyle: {
    backgroundColor: 'rgb(0, 143, 223)',
  },
  initTabsContainerStyle: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  tabStyle: {
    paddingVertical: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#0082C0',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  initActiveTabStyle: {
    backgroundColor: '#0082C0',
  },
  initTabTextStyle: {
    color: '#0082C0',
  },
  activeTabTextStyle: {
    color: 'white',
  },
  segmentContainer: {
    flexDirection: 'row',
  },
};
