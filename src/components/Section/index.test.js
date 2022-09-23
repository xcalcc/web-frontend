import React from 'react';
import { shallow } from 'enzyme';
import Section from './index';

describe('Section', () => {
  it('Render Section with wrapper', () => {
    const wrapper = shallow(<Section />);
    expect(wrapper.find('.section').length).toEqual(1);
  });
});