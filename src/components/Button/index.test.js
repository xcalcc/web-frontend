import React from 'react';
import { shallow } from 'enzyme';
import XButton from './index';

describe('XButton', () => {
  it('Render XButton with wrapper', () => {
    const wrapper = shallow(<XButton />);
    expect(wrapper.find('.xbutton').length).toEqual(1);
  });

  it('Render a color', () => {
    const wrapper = shallow(<XButton red />);
    expect(wrapper.find('.xbutton.red').length).toEqual(1);
  });

  it('Render a .icon', () => {
    const wrapper = shallow(<XButton icon="test" />);
    expect(wrapper.find('.xbutton .icon').length).toEqual(1);
  });
});
