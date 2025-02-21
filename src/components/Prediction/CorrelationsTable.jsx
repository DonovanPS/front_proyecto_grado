import React, { useEffect, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";



export default function CorrelationsTable({
  predictionData,
  addDescriptionField,
}) {
  const [showModal, setShowModal] = useState(false);
  const [modelData, setModelData] = useState(null);

  const showModelStats = (model) => {
    setModelData(model);
    setShowModal(true);
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
              <th style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>Métrica</th>
              <th style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>Valor</th>
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
          {predictionData.map(({ description, topCorrelated, evaluateModel, data }, index) => (
            <AccordionTab
              key={index}
              header={
                <>
                  Top correlaciones - {data.model} - para  {" "}
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
                    onClick={(e) => {e.stopPropagation(); 
                      showModelStats(evaluateModel)}}
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
          ))}
        </Accordion>
      </div>

      <Dialog
        header="Estadísticas del Modelo"
        visible={showModal}
        style={{ width: "90vw" }}
        onHide={hideModal}
      >
        {modelData && (
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
            <div style={{ flex: "1", marginRight: "10px" }}>
              {getModelMetricsTable(modelData.model_name, modelData.training_metrics)}
            </div>
            <div style={{ flex: "1", marginRight: "10px" }}>
              {getModelMetricsTable("Validación Cruzada", modelData.cross_validation_metrics)}
            </div>
            <div style={{ flex: "1" }}>
              {getModelMetricsTable("Modelo Ingenuo", modelData.naive_model_metrics)}
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
}