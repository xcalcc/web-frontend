import React from 'react';
import { shallow } from 'enzyme';
import CopyIcon from './index';

describe('CopyIcon', () => {
  it('Render CopyIcon with wrapper', () => {
    const wrapper = shallow(<CopyIcon />);
    expect(wrapper.find('.copy-icon').length).toEqual(1);
  });
});
