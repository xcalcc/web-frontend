import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import mockRedux from '../../../config/jest/mockRedux';
import * as actions from '../../redux/actions';
import userService from '../../services/userService';
import LoginForm from './index';

jest.mock('../../services/userService');
jest.mock('../../redux/actions');

const mockData = {
    login: {
        success: () => {
            return {
                accessToken: "mock-111-111",
                tokenType: "mock-222-222"
            }
        },
        error: ()=>{
            return {
                error: {
                    status: 401,
                    message: "mock error"
                }
            }
        }
    },
    fetchLicense: {
        success: () => {
            return {
                licenseNumber: "mock-111-111",
            }
        },
    },
    fetchVersion: {
        success: () => {
            return {
                app: {
                    version: '1.0.0'
                },
            }
        },
    },
    getCurrentUserInfo: {
        success: () => {
            return Promise.resolve({
                data: {
                    displayName: "mock-123",
                    isAdmin: "Y",
                }
            })
        },
    }
};

let wrapper;

const { mockStore } = mockRedux.create({
    initialState: {}
});

function fnAsync(callback){
    setTimeout(()=>{
        callback();
    }, 0);
}

// call in componentDidMount
actions.fetchVersion.mockImplementation(() => {
    return mockData.fetchVersion.success();
});

describe("Login page", () => {
    beforeEach(() => {
        wrapper = mount(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <LoginForm />
                </MemoryRouter>
            </Provider>
        );
    });

    test('login success', (done) => {
        actions.login.mockImplementation(() => {
            return mockData.login.success();
        });
        actions.fetchLicense.mockImplementation(() => {
            return mockData.fetchLicense.success();
        });
        userService.getCurrentUserInfo.mockImplementation(()=>{
            return mockData.getCurrentUserInfo.success();
        });

        wrapper.find("#username").simulate("change", { target: { value: "test1", name: "username" }});
        wrapper.find("#password").simulate("change", { target: { value: "test2", name: "password" }});
        wrapper.find("form").simulate("submit");

        function checkResult(){
            wrapper.update();
            let data = {
                errorMessage: wrapper.find(".error").length,
                errorDialog: wrapper.find(".sweet-alert").length
            };
            expect(data).toEqual({
                errorMessage: 0, 
                errorDialog: 0
            });
            done();
        }

        fnAsync(checkResult);
    });


    test('userName or password is error', (done) => {
        actions.login.mockImplementation(()=>{
            return mockData.login.error();
        });
        actions.fetchLicense.mockImplementation(()=>{
            return mockData.fetchLicense.success();
        });
        userService.getCurrentUserInfo.mockImplementation(()=>{
            return mockData.getCurrentUserInfo.success();
        });

        wrapper.find("#username").simulate("change", { target: { value: "test1", name: "username" }});
        wrapper.find("#password").simulate("change", { target: { value: "test2", name: "password" }});
        wrapper.find("form").simulate("submit");

        function checkResult(){
            wrapper.update();
            expect(wrapper.find(".sweet-alert").length).toBe(1);
            done();
        }

        fnAsync(checkResult);
    });


    test("userName and password are empty", () => {
        wrapper.find("#username").simulate("change", { target: { value: "", name: "username" }});
        wrapper.find("#password").simulate("change", { target: { value: "", name: "password" }});
        wrapper.find("form").simulate("submit");
        expect(wrapper.find(".error").length).toBe(2);
    });


    test("userName is empty and password is not empty", () => {
        wrapper.find("#username").simulate("change", { target: { value: "", name: "username" }});
        wrapper.find("#password").simulate("change", { target: { value: "test1", name: "password" }});
        wrapper.find("form").simulate("submit");
        let data = {
            usernameError: wrapper.find(".login-username").find(".error").length,
            passwordError: wrapper.find(".login-password").find(".error").length
        };
        expect(data).toEqual({
            usernameError: 1, 
            passwordError: 0
        });
    });


    test("userName is not empty and password is empty", () => {
        wrapper.find("#username").simulate("change", { target: { value: "test1", name: "username" }});
        wrapper.find("form").simulate("submit");
        let data = {
            usernameError: wrapper.find(".login-username").find(".error").length,
            passwordError: wrapper.find(".login-password").find(".error").length
        };
        expect(data).toEqual({
            usernameError: 0, 
            passwordError: 1
        });
    });
})