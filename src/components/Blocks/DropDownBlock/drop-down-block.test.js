import React from 'react';
import { shallow } from 'enzyme';
import DropDownBlock from './index';

describe('DropdownBlock', () => {
  it('Render DropDownBlock with wrapper', () => {
    const wrapper = shallow(<DropDownBlock currentOption="test" />);
    expect(wrapper.find('.drop-down-block').length).toEqual(1);
  });
});
