import React from 'react';
import { shallow } from 'enzyme';
import SearchBox from './index';

describe('SearchBox', () => {
  it('Render SearchBox with wrapper', () => {
    const wrapper = shallow(<SearchBox />);
    expect(wrapper.find('.scanning-search').length).toEqual(1);
  });
});