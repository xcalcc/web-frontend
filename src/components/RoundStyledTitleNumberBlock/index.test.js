import React from 'react';
import { shallow } from 'enzyme';
import RoundStyledTitleNumberBlock from './index';

describe('RoundStyledTitleNumberBlock', () => {
  it('Render RoundStyledTitleNumberBlock with wrapper', () => {
    const wrapper = shallow(<RoundStyledTitleNumberBlock />);
    expect(wrapper.find('.round-styled-title-number-block').length).toEqual(1);
  });
});