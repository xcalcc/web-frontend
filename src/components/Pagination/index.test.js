import React from 'react';
import { shallow } from 'enzyme';
import Pagination from './index';

describe('Pagination', () => {
  it('Render Pagination with wrapper', () => {
    const wrapper = shallow(<Pagination pageSize={10} totalPages={5} currentPage={2} />);
    expect(wrapper.find('.x-pagination').length).toEqual(1);
  });
});
