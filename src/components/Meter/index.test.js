import React from 'react';
import { shallow } from 'enzyme';
import Meter  from './index';

describe('Meter ', () => {
  it('Render Meter  with wrapper', () => {
    const wrapper = shallow(<Meter title='test' />);
    expect(wrapper.find('.meterbox').length).toEqual(1);
  });
});