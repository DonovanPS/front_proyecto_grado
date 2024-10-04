"use client";

import React, { useState } from "react";
import FolderSelector from "@/components/Folder/FolderSelector";
import FileUploader from "@/components/Folder/FileUploader";
import TableComponent from "@/components/table";
import PredictionForm from "@/components/Prediction/PredictionForm";
import PredictionGraph from "@/components/Prediction/PredictionGraph";
import CorrelationsTable from "@/components/Prediction/CorrelationsTable";
import PrimeReactToast from "@/components/Toast";
import LinearProgress from "@mui/material/LinearProgress"; // Importar LinearProgress
import { ProgressBar } from "primereact/progressbar";

export default function Page() {
  const [showTableAndPredictions, setShowTableAndPredictions] = useState(false);
  const [predictionData, setPredictionData] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [descriptions, setDescriptions] = useState(['']);

  
  const addDescriptionField = (newDescription) => {
    setDescriptions([...descriptions, newDescription]);
  };

  return (
    <>
      <FolderSelector setShowTableAndPredictions={setShowTableAndPredictions} />

      {showTableAndPredictions && (
        <>
          <FileUploader />
          <TableComponent />

          <div className="card predicciones relative">
            <h2 className="card-title">Predicciones</h2>

            <PredictionForm
              setPredictionData={setPredictionData}
              setLoading={setLoading} 
              loading={loading} 
              descriptions={descriptions} // Pasar descripciones
              setDescriptions={setDescriptions} // Pasar función para actualizar descripciones
            
            />
            {loading && (
              <div className="mt-4">
                <ProgressBar mode="indeterminate" style={{ height: '6px' }}></ProgressBar>
              </div>
            )}

            <PredictionGraph predictionData={predictionData} />
            <CorrelationsTable predictionData={predictionData} addDescriptionField={addDescriptionField}  />
          </div>
        </>
      )}
      <PrimeReactToast />
    </>
  );
}
