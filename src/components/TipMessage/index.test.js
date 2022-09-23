import React from 'react';
import { shallow } from 'enzyme';
import TipMessage from './index';

describe('TipMessage', () => {
  it('Render TipMessage with wrapper', () => {
    const wrapper = shallow(<TipMessage />);
    expect(wrapper.find('.tip-message').length).toEqual(1);
  });
});