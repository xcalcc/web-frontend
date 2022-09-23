import React from 'react';
import { shallow } from 'enzyme';
import TwoLineLeftRightBlock from './index';

describe('TwoLineLeftRightBlock', () => {
  it('Render TwoLineLeftRightBlock with wrapper', () => {
    const props = {
      line1: {
        title: 'test1',
        data: 'test'
      },
      line2: {
        title: 'test2',
        data: 'test'
      }
    };
    const wrapper = shallow(<TwoLineLeftRightBlock {...props} />);
    expect(wrapper.find('.two-line-left-right-block').length).toEqual(1);
  });
});
