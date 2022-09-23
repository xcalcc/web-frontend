import React from 'react';
import { shallow } from 'enzyme';
import CircleChart from './CircleChart';

describe('CircleChart', () => {
  it('Render CircleChart with wrapper', () => {
    const wrapper = shallow(<CircleChart />);
    expect(wrapper.find('.barChartCompoent').length).toEqual(1);
  });
});
