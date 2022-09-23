import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import store from 'Redux/store';
import Header from './index';

describe('Header', () => {
  it('Render Header with wrapper', () => {
    jest.mock("react-redux", () => ({
        ...jest.requireActual("react-redux"),
        useSelector: jest.fn(),
        useDispatch: jest.fn(),
    }));

    const wrapper = mount(
        <Provider store={store}>
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        </Provider>
    );

    expect(wrapper.html().indexOf('app-header')).toBeGreaterThan(-1);
  });
});
