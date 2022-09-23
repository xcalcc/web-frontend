import React from 'react';
import { shallow } from 'enzyme';
import XToast from './index';

describe('Toast', () => {
  it('Render Toast with wrapper', () => {
    const wrapper = shallow(<XToast />);
    expect(wrapper.find('.xtoast').length).toEqual(1);
  });
});