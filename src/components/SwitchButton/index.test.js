import React from 'react';
import { shallow } from 'enzyme';
import SwitchButton from './index';

describe('SwitchButton', () => {
  it('Render SwitchButton with wrapper', () => {
    const wrapper = shallow(<SwitchButton />);
    expect(wrapper.find('.switch-button').length).toEqual(1);
  });
});