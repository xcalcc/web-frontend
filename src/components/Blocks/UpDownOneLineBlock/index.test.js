import React from 'react';
import { shallow } from 'enzyme';
import UpDownOneLineBlock from './index';

describe('UpDownOneLineBlock', () => {
  it('Render UpDownOneLineBlock with wrapper', () => {
    const wrapper = shallow(<UpDownOneLineBlock />);
    expect(wrapper.find('.up-down-one-line-block').length).toEqual(1);
  });
});
