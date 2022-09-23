import React from 'react';
import { shallow } from 'enzyme';
import TrendIcon from './index';

describe('TrendIcon', () => {
  it('Render TrendIcon with wrapper', () => {
    const wrapper = shallow(<TrendIcon value={4} baselineValue={5} />);
    expect(wrapper.find('Image').length).toEqual(1);
  });
});