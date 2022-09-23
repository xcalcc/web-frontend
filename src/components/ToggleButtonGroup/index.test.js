import React from 'react';
import { shallow } from 'enzyme';
import ToggleButtonGroupControlled from './index';

describe('ToggleButtonGroupControlled', () => {
  it('Render ToggleButtonGroupControlled with wrapper', () => {
    const wrapper = shallow(<ToggleButtonGroupControlled />);
    expect(wrapper.find('.toggle-btn-group').length).toEqual(1);
  });
});