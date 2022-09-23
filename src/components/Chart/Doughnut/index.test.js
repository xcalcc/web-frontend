import React from 'react';
import { shallow } from 'enzyme';
import Doughnut from './index';

describe('Doughnut', () => {
  it('Render Doughnut with wrapper', () => {
    shallow(<Doughnut data={{}} />);
  });
});
