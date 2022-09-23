import React from 'react';
import { shallow } from 'enzyme';
import CustomDropdown from './index';

describe('CustomDropdown', () => {
  it('Render CustomDropdown with wrapper', () => {
    const wrapper = shallow(<CustomDropdown lable="test" />);
    expect(wrapper.find('.custom-dropdown').length).toEqual(1);
  });
});