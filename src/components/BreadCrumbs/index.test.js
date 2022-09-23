import React from 'react';
import { mount } from 'enzyme';
import {MemoryRouter} from 'react-router-dom';
import BreadCrumbs from './index';

describe('BreadCrumbs', () => {
  it('Render BreadCrumbs with wrapper', () => {
    const props = {
      data: [{
            title: 'test1',
            path: undefined
        }
      ]
    };
    const wrapper = mount(
        <MemoryRouter>
            <BreadCrumbs {...props} />
        </MemoryRouter>
    );
    expect(wrapper.find('.breadcrumbs').length).toEqual(1);
  });
});
