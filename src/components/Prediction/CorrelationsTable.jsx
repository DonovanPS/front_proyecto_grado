import React, { useEffect, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useFileContext } from "@/app/context/fileContex";
import Grid from "@mui/material/Unstable_Grid2";
import ComponentPredictionPraph from "../prediction-praph";

export default function CorrelationsTable({
  predictionData,
  addDescriptionField,
}) {
  const [showModal, setShowModal] = useState(false);
  const [modelData, setModelData] = useState(null);

  const { groupedData } = useFileContext();

  const [statisticsModelsCV, setStatisticsModelsCV] = useState([]);

  

  useEffect(() => {
    console.log("statisticsModelsCV:", statisticsModelsCV);
    console.log("modelData:", modelData);

    console.log("naive:", modelData?.naive_model_metrics);
   
  }, [statisticsModelsCV]);


  useEffect(() => {
    if (modelData) {
      console.log("modelData disponible:", modelData);

    
      const naive = {
        training_metrics: {
          ...modelData?.naive_model_metrics 
        },
        "historical_stats": {
          "model": "Naive",
        }
      };

    
      setStatisticsModelsCV(prevState => [...prevState, naive]);
    }
  }, [modelData]); 


  useEffect(() => {
    console.log("El componente se ha montado");
   
    const fetchData = async () => {
      const data = await obtenerModelData(); 
      setModelData(data);
    };

    fetchData();
  }, []);

  const showModelStats = (model) => {
    setModelData(model);
    setShowModal(true);

    const description =
      model.historical_stats?.DESCRIPCION || "Descripción no disponible";

    const infoModels = groupedData[description];

    setStatisticsModelsCV(
      infoModels.map((model) => ({
        training_metrics: model.training_metrics,
        historical_stats: model.historical_stats,
      }))
    );

    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100); 
  };

  const hideModal = () => {
    setShowModal(false);
  };

  // Función para generar las tablas con las métricas - **Análisis simplificado**
  const getModelMetricsTable = (label, metrics) => {
    return (
      <div className="model-table">
        <h5>{label}</h5>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>
                Métrica
              </th>
              <th style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>
                Valor
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(metrics).map((key) => (
              <tr key={key}>
                <td style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>
                  {key.toUpperCase()}
                </td>
                <td style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>
                  {metrics[key] !== null &&
                  metrics[key] !== undefined &&
                  typeof metrics[key] === "number"
                    ? metrics[key].toFixed(2)
                    : metrics[key] !== null && metrics[key] !== undefined
                    ? metrics[key]
                    : "No disponible"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <div className="mt-4">
        <Accordion multiple activeIndex={[0]}>
          {predictionData.map(
            ({ description, topCorrelated, evaluateModel, data }, index) => (
              <AccordionTab
                key={index}
                header={
                  <>
                    Top correlaciones - {data.model} - para{" "}
                    <code
                      style={{
                        backgroundColor: "#424242",
                        padding: ".15rem .3rem",
                        borderRadius: ".25rem",
                        fontFamily: "monospace",
                        fontSize: "1em",
                      }}
                    >
                      {description}
                    </code>
                    <Button
                      icon="pi pi-chart-bar"
                      className="p-button-sm p-button-text"
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "10px",
                        fontSize: "1.2rem",
                        cursor: "pointer",
                        transform: "translateY(-50%)",
                        padding: "0.5rem",
                        borderRadius: "50%",
                      }}
                      aria-label="Estadísticas"
                      onClick={(e) => {
                        e.stopPropagation();
                        showModelStats(evaluateModel);
                      }}
                    />
                  </>
                }
              >
                <DataTable
                  className="text-sm"
                  value={topCorrelated.top_correlated_medications}
                  size="small"
                  tableStyle={{ minWidth: "50rem", position: "relative" }}
                >
                  <Column
                    field="medication"
                    header="Descripción"
                    headerClassName="text-sm py-0 px-2"
                    bodyClassName="text-sm py-0 px-2"
                  ></Column>
                  <Column
                    field="correlation"
                    header="Correlación"
                    body={(rowData) => rowData.correlation.toFixed(4)}
                    headerClassName="text-sm py-0 px-2"
                    bodyClassName="text-sm py-0 px-2"
                  ></Column>
                  <Column
                    header="Acción"
                    headerClassName="text-sm py-0 px-2"
                    bodyClassName="text-sm py-0 px-2"
                    body={(rowData) => (
                      <Button
                        className="p-button-sm p-button-text"
                        icon="pi pi-plus"
                        rounded
                        text
                        aria-label="Agregar"
                        onClick={() => addDescriptionField(rowData.medication)}
                      />
                    )}
                  ></Column>
                </DataTable>
              </AccordionTab>
            )
          )}
        </Accordion>
      </div>

      <Dialog
        header={
          `Modelo ${modelData?.historical_stats?.model} - ` +
          `${modelData?.historical_stats?.DESCRIPCION}  `
        }
        visible={showModal}
        style={{ width: "90vw" }}
        onHide={hideModal}
      >
        {modelData && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: "1", marginRight: "10px" }}>
              {getModelMetricsTable(
                modelData.model_name,
                modelData.training_metrics
              )}
            </div>
            {/*
             <div style={{ flex: "1", marginRight: "10px" }}>
              {getModelMetricsTable("Validación Cruzada", modelData.cross_validation_metrics)}
            </div>
            */}

            <div style={{ flex: "1" }}>
              {getModelMetricsTable(
                "Modelo Ingenuo",
                modelData.naive_model_metrics
              )}
            </div>
          </div>
        )}

        <div className="card">
          <h2 className="card-title">Comparación de modelos</h2>
          <Grid xs={12} md={6} lg={8}>
            <ComponentPredictionPraph
              title="Métricas de Modelos"
              subheader="Comparación entre los modelos de predicción"
              chart={{
                labels: [
                  statisticsModelsCV.map(
                    (model) => model.historical_stats.model
                  ),
                ],

                series: Object.keys(
                  statisticsModelsCV[0]?.training_metrics || {}
                ).map((metric) => ({
                  name: `${metric.toUpperCase()} (CV)`, // Nombre de la serie
                  type: "column", // Tipo de gráfico
                  data: statisticsModelsCV.map((model) => {
                    // Verificar que `model.training_metrics` y `metric` existan antes de acceder
                    const value = model.training_metrics?.[metric];
                    return value !== undefined
                      ? parseFloat(value.toFixed(2))
                      : 0; // Redondeo y manejo de `undefined`
                  }),
                })),

                options: {
                  chart: {
               
                  },

                  xaxis: {
                    type: "category",
                    categories: statisticsModelsCV.map(
                      (model) => model.historical_stats.model
                    ),
                    tickPlacement: "between", // Posiciona los ticks entre las categorías
                  },
                  yaxis: {
                    min: 0,
                    max: statisticsModelsCV[0]?.historical_stats?.max + 10 || 0,
                  },
                  annotations: {
                    yaxis: [
                      {
                        y:
                          statisticsModelsCV[0]?.historical_stats?.mean -
                            statisticsModelsCV[0]?.historical_stats?.std || 0,
                        y2:
                          statisticsModelsCV[0]?.historical_stats?.mean +
                            statisticsModelsCV[0]?.historical_stats?.std || 0,
                        borderColor: "#00FF00",
                        fillColor: "#FFA500",
                        opacity: 0.2,
                        label: {
                          text: `± Desv. Estándar ${parseFloat(
                            statisticsModelsCV[0]?.historical_stats?.std
                          ).toFixed(2)}`,
                          style: {
                            color: "#fff",
                            background: "#FFA500",
                          },
                        },
                      },
                      {
                        y: statisticsModelsCV[0]?.historical_stats?.mean || 0,
                        borderColor: "#00008B",
                        strokeDashArray: 4,
                        label: {
                          text: `Promedio ${parseFloat(statisticsModelsCV[0]?.historical_stats?.mean).toFixed(2)}`,
                          style: {
                            color: "#fff",
                            background: "#00008B",
                          },
                        },
                      },
                      {
                        y: statisticsModelsCV[0]?.historical_stats?.max || 0,
                        borderColor: "#ff0000",
                        strokeDashArray: 4,
                        label: {
                          text: `Máximo ${statisticsModelsCV[0]?.historical_stats?.max}`,
                          style: {
                            color: "#fff",
                            background: "#ff0000",
                          },
                        },
                      },
                      {
                        y: statisticsModelsCV[0]?.historical_stats?.min || 0,
                        borderColor: "#008000",
                        strokeDashArray: 4,
                        label: {
                          text: `Mínimo ${statisticsModelsCV[0]?.historical_stats?.min}`,
                          style: {
                            color: "#fff",
                            background: "#008000",
                          },
                        },
                      },
                    ],
                  },
                },
              }}
            />
          </Grid>
        </div>
      </Dialog>
    </>
  );
}
