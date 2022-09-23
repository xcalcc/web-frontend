import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import store from 'Redux/store';
import SideBar from './index';

describe('SideBar', () => {
  it('Render SideBar with wrapper', () => {
    jest.mock("react-redux", () => ({
        ...jest.requireActual("react-redux"),
        useSelector: jest.fn(),
        useDispatch: jest.fn(),
    }));

    const wrapper = mount(
        <Provider store={store}>
            <MemoryRouter>
                <SideBar />
            </MemoryRouter>
        </Provider>
    );
    expect(wrapper.find('.side-bar').length).toEqual(1);
  });
});
