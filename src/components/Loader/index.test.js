import React from 'react';
import { shallow } from 'enzyme';
import Loader  from './index';

describe('Loader ', () => {
  it('Render Loader  with wrapper', () => {
    const wrapper = shallow(<Loader type='overlay' />);
    expect(wrapper.find('.loader-spinning').length).toEqual(1);
  });
});