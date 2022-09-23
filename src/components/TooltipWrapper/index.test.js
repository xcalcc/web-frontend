import React from 'react';
import { shallow } from 'enzyme';
import TooltipWrapper from './index';

describe('TooltipWrapper', () => {
  it('Render TooltipWrapper with wrapper', () => {
    const wrapper = shallow(<TooltipWrapper />);
    expect(wrapper.find('.default-info-tooltip').length).toEqual(1);
  });
});