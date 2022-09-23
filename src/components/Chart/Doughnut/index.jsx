import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import PropTypes from 'prop-types';

const opt = {
  cutoutPercentage: 93,
};

function ChartDoughnut({ data }) {
  return <Doughnut data={data} options={opt} />;
}

ChartDoughnut.propTypes = {
  data: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default ChartDoughnut;
