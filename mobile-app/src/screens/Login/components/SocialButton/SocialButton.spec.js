import React from 'react';
import { TouchableOpacity } from 'react-native';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import SocialButton from './SocialButton';

describe('Testing SocialButton', () => {
  it('renders correctly', () => {
    const onPress = () => {};
    const tree = renderer
      .create(<SocialButton
        icon="facebook"
        color="white"
        text="Example"
        onPress={onPress}
      />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('reacts to press', () => {
    const onPress = sinon.spy();
    const wrapper = shallow(
      <SocialButton icon="facebook" color="white" text="Example" onPress={onPress} />,
    );
    wrapper.simulate('press');

    expect(wrapper.find(TouchableOpacity)).toHaveLength(1);
    expect(onPress.calledOnce).toBe(true);
  });
});
