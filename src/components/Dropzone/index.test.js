import React from 'react';
import { shallow } from 'enzyme';
import Dropzone from './index';

describe('Dropzone', () => {
  it('Render Dropzone with wrapper', () => {
    const wrapper = shallow(<Dropzone />);
    expect(wrapper.find('.dropzone').length).toEqual(1);
  });
});