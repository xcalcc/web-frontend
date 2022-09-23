import React from 'react';
import { shallow } from 'enzyme';
import DropDownWithTitle from './index';

describe('DropDownWithTitle', () => {
  it('Render DropDownWithTitle with wrapper', () => {
    const wrapper = shallow(<DropDownWithTitle title="test" />);
    expect(wrapper.find('.dropdown-with-title').length).toEqual(1);
  });
});