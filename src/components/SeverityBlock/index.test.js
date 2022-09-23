import React from 'react';
import { shallow } from 'enzyme';
import SeverityBlock from './index';

describe('SeverityBlock', () => {
  it('Render SeverityBlock with wrapper', () => {
    const wrapper = shallow(<SeverityBlock data={{}} />);
    expect(wrapper.find('.severity-block').length).toEqual(1);
  });
});