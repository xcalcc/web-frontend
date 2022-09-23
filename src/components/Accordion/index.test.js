import React from 'react';
import { shallow } from 'enzyme';
import Accordion  from './index';

describe('Accordion ', () => {
  it('Render Accordion  with wrapper', () => {
    const wrapper = shallow(<Accordion show={true} title='test' />);
    expect(wrapper.html().indexOf('x-accordion')).toBeGreaterThan(-1);
  });
});