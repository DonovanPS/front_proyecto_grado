import React from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

export default function CorrelationsTable({
  predictionData,
  addDescriptionField,
}) {
  return (
    <>

      <div className="mt-4">
        <Accordion multiple activeIndex={[0]}>
          {predictionData.map(({ description, topCorrelated }, index) => (
            <AccordionTab
              key={index}
              header={
                <>
                  Top correlaciones para{" "}
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
                </>
              }
            >
              <DataTable
                className="text-sm"
                value={topCorrelated.top_correlated_medications}
                size="small"
                tableStyle={{ minWidth: "50rem" }}
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
                      className="p-button-sm"
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
    </>
  );
}
