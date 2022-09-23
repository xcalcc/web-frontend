import React from 'react';
import { shallow } from 'enzyme';
import BarChart from './BarChart';

describe('BarChart', () => {
  it('Render BarChart with wrapper', () => {
    const wrapper = shallow(<BarChart />);
    expect(wrapper.find('.barChartCompoent').length).toEqual(1);
  });
});
