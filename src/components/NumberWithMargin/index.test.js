import React from 'react';
import { shallow } from 'enzyme';
import NumberWithMargin from './index';

describe('NumberWithMargin', () => {
  it('Render NumberWithMargin with wrapper', () => {
    const wrapper = shallow(<NumberWithMargin title='test' />);
    expect(wrapper.find('.number-with-margin').length).toEqual(1);
  });
});