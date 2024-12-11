import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import ComponentPredictionPraph from "@/components/prediction-praph";

export default function PredictionGraph({ predictionData, periods }) {

  
  
  const getOnlyPredictions = (data) => {
   
    
    if (
      data &&
      Array.isArray(data.predictions) &&
      Array.isArray(data.historical_data)
    ) {
      const lastHistoricalValue =
        data.historical_data[data.historical_data.length - 1].y;

      const predictions = data.predictions.filter(
        (prediction) =>
          prediction.ds >
          data.historical_data[data.historical_data.length - 1].ds
      );

      if (predictions.length > 0) {
        predictions.unshift({
          ds: data.historical_data[data.historical_data.length - 1].ds,
          yhat: lastHistoricalValue,
        });
      }

      return predictions;
    }
    return [];
  };

  if (!predictionData.length) return null;

  // Usar un conjunto para almacenar descripciones únicas ya procesadas
  const processedDescriptions = new Set();
  const processedPredictions = new Set();

  const dataExample = predictionData[0].data;
  const labels = [
    ...dataExample.historical_data.map((item) => item.ds),
    ...getOnlyPredictions(dataExample).map((item) => item.ds),
  ];

  const series = predictionData.flatMap(({ description, data }) => {
    
    const historicalValues = data.historical_data.map((item) => item.y);
    const predictionValues = getOnlyPredictions(data).map((item) => item.yhat);

    // Verificar si ya se procesó el histórico para esta descripción
    const includeHistorical = !processedDescriptions.has(description);
    if (includeHistorical) processedDescriptions.add(description);

    // Generar una clave única para las predicciones (descripción + serie)
    const predictionKey = `${description}-${predictionValues.join(",")}`;
    const includePrediction = !processedPredictions.has(predictionKey);
    if (includePrediction) processedPredictions.add(predictionKey);

    return [
      includeHistorical && {
        name: `${description} - Hist.`,
        type: "line",
        data: [
          ...historicalValues,
          ...Array(predictionValues.length).fill(null),
        ],
      },
      includePrediction && {
        name: `${description} - Pred. - ${data.model}`,
        type: "line",
        data: [
          ...Array(historicalValues.length).fill(null),
          ...predictionValues,
        ],
      },
    ].filter(Boolean); // Filtrar entradas nulas
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
