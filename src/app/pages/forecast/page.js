"use client";

import React, { use, useEffect, useState } from "react";
import FileUploader from "@/components/Folder/FileUploader";
import TableComponent from "@/components/table";
import PredictionForm from "@/components/Prediction/PredictionForm";
import PredictionGraph from "@/components/Prediction/PredictionGraph";
import CorrelationsTable from "@/components/Prediction/CorrelationsTable";
import PrimeReactToast from "@/components/Toast";
import LinearProgress from "@mui/material/LinearProgress"; // Importar LinearProgress
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { useFileContext } from "@/app/context/fileContex";


export default function Page() {
  const [showTableAndPredictions, setShowTableAndPredictions] = useState(false);
  const [predictionData, setPredictionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [descriptions, setDescriptions] = useState(['']);
  const { folder, setFolder } = useFileContext(); 

  
  useEffect(() => {
    // Si folder está vacío en el contexto, carga desde el localStorage
    if (!folder) {
      const storedFolderPath = localStorage.getItem("folderPath");
      if (storedFolderPath) {
        setFolder(storedFolderPath); // Establecerlo en el contexto
      }
    }
  }, [folder, setFolder]);

  const addDescriptionField = (newDescription) => {
    setDescriptions([...descriptions, newDescription]);
  };


  return (
    <>
        <>
          <FileUploader />
          <TableComponent />

          <div className="card predicciones relative">
            <h2 className="card-title" style={{color: 'white'}}>Predicciones</h2>

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
            <CorrelationsTable predictionData={predictionData} addDescriptionField={addDescriptionField} />
          </div>
        </>
    
      <PrimeReactToast />
    </>
  );
}
