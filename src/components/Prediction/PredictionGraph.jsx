import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import ComponentPredictionPraph from "@/components/prediction-praph";

export default function PredictionGraph({ predictionData, periods }) {

    const getOnlyPredictions = (data) => {
        if (data && Array.isArray(data.predictions) && Array.isArray(data.historical_data)) {
            const lastHistoricalValue = data.historical_data[data.historical_data.length - 1].y;
        
            // Obtener las predicciones
            const predictions = data.predictions.filter(prediction => prediction.ds > data.historical_data[data.historical_data.length - 1].ds);
        
            // Agregar el último valor histórico como la primera predicción
            if (predictions.length > 0) {
              predictions.unshift({ ds: data.historical_data[data.historical_data.length - 1].ds, yhat: lastHistoricalValue });
            }
        
            return predictions;
          }
          return [];
      };

  if (!predictionData.length) return null;

  const dataExample = predictionData[0].data;
  const labels = [
    ...dataExample.historical_data.map((item) => item.ds),
    ...getOnlyPredictions(dataExample).map((item) => item.ds),
  ];

  const series = predictionData.flatMap(({ description, data }) => {
    const historicalValues = data.historical_data.map((item) => item.y);
    const predictionValues = getOnlyPredictions(data).map((item) => item.yhat);

    return [
      {
        name: `${description} - Histórico`,
        type: "line",
        data: [...historicalValues, ...Array(predictionValues.length - 1).fill(null)],
      },
      {
        name: `${description} - Predicción`,
        type: "line",
        data: [...Array(historicalValues.length - 1).fill(null), ...predictionValues],
      },
    ];
  });

  return (
    <Grid xs={12} md={6} lg={8} className="mt-4">
      <ComponentPredictionPraph
        title="Comparación de Predicciones"
        subheader="Comparativa entre descripciones"
        chart={{ labels, series }}
      />
    </Grid>
  );
}
