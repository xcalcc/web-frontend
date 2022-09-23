import React from 'react';
import { shallow } from 'enzyme';
import Steps from './index';

describe('Steps', () => {
  it('Render Steps with wrapper', () => {
    const wrapper = shallow(<Steps totalSteps={3} current={1} />);
    expect(wrapper.find('.steps').length).toEqual(1);
  });
});