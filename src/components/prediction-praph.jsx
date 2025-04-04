import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/Card';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function ComponentPredictionPraph({ title, subheader, chart, ...other }) {
    const { labels, colors, series, options } = chart;
    const [isClient, setIsClient] = useState(false); 

    useEffect(() => {
        setIsClient(true); // Cambiar a verdadero cuando el componente se monte en el cliente
    }, []);

    const formatValue = (value) => {
        if (value === null || value === undefined) {
            return '';
        }
        if (value === 0) {
            return '0';
        }
        const formattedValue = value.toFixed(1);
        return formattedValue.endsWith('.0') ? formattedValue.slice(0, -2) : formattedValue;
    };


    // Función para verificar si una cadena es una fecha válida
    const isValidDate = (dateStr) => !isNaN(Date.parse(dateStr));

    // Determinar si todas las etiquetas son fechas válidas
    const areDates = labels.every(isValidDate);


    const xaxisConfig = areDates
    ? { type: 'datetime' } // Si son fechas, usar datetime
    : { type: 'category', categories: labels }; // Si son strings, usar category y asignar las categorías

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
            ...xaxisConfig,
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

    if (!isClient) {
        return null; // Retorna null en el servidor para evitar renderizado
    }

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
