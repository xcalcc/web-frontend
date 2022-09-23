import React from 'react';
import { shallow } from 'enzyme';
import DoughnutNumber from './index';

describe('DoughnutNumber', () => {
  it('Render DoughnutNumber with wrapper', () => {
    const wrapper = shallow(<DoughnutNumber />);
    expect(wrapper.find('.doughnut-number').length).toEqual(1);
  });
});
