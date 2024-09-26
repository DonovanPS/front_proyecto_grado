import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Chart from 'react-apexcharts';

export default function ComponentPredictionPraph({ title, subheader, chart, ...other }) {
  const { labels, colors, series, options } = chart;

  // Log series to see their structure
  useEffect(() => {

  }, [series]);

  const formatValue = (value) => {
    if (value === null || value === undefined) {
      return ''; // Devuelve una cadena vacía para valores nulos o indefinidos
    }
    if (value === 0) {
      return '0';
    }
    const formattedValue = value.toFixed(1);
    return formattedValue.endsWith('.0') ? formattedValue.slice(0, -2) : formattedValue;
  };

  const chartOptions = {
    colors,
    plotOptions: {
      bar: {
        columnWidth: '16%',
      },
    },
    fill: {
      type: series.map((i) => i.fill),
    },
    labels,
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      labels: {
        formatter: formatValue,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: formatValue,
      },
    },
    ...options,
  };

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ p: 3, pb: 1 }}>
        <Chart
          dir="ltr"
          type="line"
          series={series}
          options={chartOptions}
          width="100%"
          height={364}
        />
      </Box>
    </Card>
  );
}

ComponentPredictionPraph.propTypes = {
  chart: PropTypes.object.isRequired,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
