import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { AutoComplete } from "primereact/autocomplete";
import { InputText } from "primereact/inputtext";
import { useFileContext } from "@/app/context/fileContex";
import PrimeReactToast from "../Toast";
import S3Service from "@/service/s3Service";
import DataService from "@/service/dataService";
import { Dropdown } from "primereact/dropdown";

export default function PredictionForm({
  onSubmit,
  setPredictionData,
  setLoading,
  loading,
  descriptions,
  setDescriptions,
}) {
  const [alertMessage, setAlertMessage] = useState(null);
  const [filteredDescriptions, setFilteredDescriptions] = useState([]);
  const [descriptionsList, setDescriptionsList] = useState([]);
  const [periods, setPeriods] = useState(6);
  const [selectedModel, setSelectedModel] = useState({ name: "Prophet", code: "prophet" });

  // Estado adicional para los modelos personalizados por descripción
  const [customModels, setCustomModels] = useState([]);

  const models = [
    { name: "Prophet", code: "prophet" },
    { name: "Xgboost", code: "xgboost" },
    { name: "Sarimax", code: "sarimax" },
    { name: "Personalizado", code: "personalizado" },
  ];

  const { folder, checkFileName } = useFileContext();

  useEffect(() => {
    setDescriptions(["EQUIPO ADMINISTRACION CON BOMBA FREEGO + BOLSA X 1500 ML"]);
    setCustomModels([""]); // Inicializar modelos personalizados
  }, []);
  
  useEffect(() => {
    setCustomModels([""]); // Inicializar modelos personalizados
  }, [selectedModel]);

 

  useEffect(() => {
    if (checkFileName) {
      S3Service.getDescriptions(folder, checkFileName)
        .then((data) => {
          if (data && data.success) {
            setDescriptionsList(data.descriptions);
          }
        })
        .catch((error) => {
          console.error("Error al cargar las descripciones:", error);
        });
    }
  }, [folder, checkFileName]);

  const searchDescription = (event) => {
    const query = event.query.toLowerCase();
    let suggestions = query.trim()
      ? descriptionsList.filter((desc) => desc.toLowerCase().includes(query))
      : [...descriptionsList];
    setFilteredDescriptions(suggestions);
  };

  const handleDescriptionChange = (value, index) => {
    const newDescriptions = [...descriptions];
    newDescriptions[index] = value;
    setDescriptions(newDescriptions);
  };

  const addDescriptionField = () => {
    setDescriptions([...descriptions, ""]);
    setCustomModels([...customModels, ""]); // Agregar un modelo personalizado vacío para la nueva descripción
  };

  const removeDescriptionField = (index) => {
    if (descriptions.length > 1) {
      setDescriptions(descriptions.filter((_, i) => i !== index));
      setCustomModels(customModels.filter((_, i) => i !== index)); // Remover el modelo personalizado correspondiente
    }
  };

  const handleCustomModelChange = (value, index) => {
    const newCustomModels = [...customModels];
    newCustomModels[index] = value;
    setCustomModels(newCustomModels);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Inicia la carga
    try {
      if (!checkFileName) {
        setAlertMessage({
          severity: "warn",
          summary: "Archivo no seleccionado",
          content: "Por favor seleccione un archivo.",
          life: 3000,
        });
        setLoading(false);
        return;
      }

      const predictionsPromises = descriptions.map(async (description, index) => {
        const modelCode = customModels[index]?.code || selectedModel.code;
        const [data, topCorrelated, evaluateModel] = await Promise.all([
          DataService.getPrediction(folder, checkFileName, description, periods, modelCode),
          DataService.getTopCorrelatedMedications(folder, checkFileName, description, 5, modelCode),
          DataService.getEvaluateModel(folder, checkFileName, description, 55656, modelCode),

        ]);
        return { description, data, topCorrelated, evaluateModel };
      });

      const predictions = await Promise.all(predictionsPromises);
      setPredictionData(predictions);
    } catch (error) {
      console.error("Error al obtener la predicción:", error);
    } finally {
      setLoading(false); // Finaliza la carga
    }
  };

  return (
    <>
      <Button
        icon="pi pi-plus"
        className="absolute top-2 right-2"
        rounded
        text
        severity="success"
        aria-label="Agregar Predicción"
      />

      <div className="flex justify-start mt-4 mb-4">
        <Dropdown
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.value)}
          options={models}
          optionLabel="name"
          placeholder="Selecciona un Modelo"
          className="w-full md:w-14rem"
        />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <div className="flex flex-col space-y-2">
          {descriptions.map((description, index) => (
            <div key={index} className="flex items-center space-x-2">
              {selectedModel.code === "personalizado" && (
                <Dropdown
                  value={customModels[index]}
                  onChange={(e) => handleCustomModelChange(e.value, index)}
                  options={models.filter((model) => model.code !== "personalizado")}
                  optionLabel="name"
                  placeholder="Modelo"
                  className="w-10rem"
                />
              )}
              <div className="flex-grow">
                <AutoComplete
                  value={description}
                  suggestions={filteredDescriptions}
                  completeMethod={searchDescription}
                  onChange={(e) => handleDescriptionChange(e.value, index)}
                  placeholder="Descripción"
                  className="w-full p-fluid"
                />
              </div>

              {index === descriptions.length - 1 && (
                <Button
                  icon="pi pi-plus"
                  rounded
                  text
                  severity="success"
                  aria-label="+"
                  onClick={addDescriptionField}
                />
              )}
              {descriptions.length > 1 && (
                <Button
                  icon="pi pi-times"
                  rounded
                  text
                  severity="danger"
                  aria-label="-"
                  type="button"
                  onClick={() => removeDescriptionField(index)}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <InputText
            keyfilter="int"
            placeholder="Número de Períodos"
            value={periods}
            onChange={(e) => setPeriods(Number(e.target.value))}
            className="mb-0 w-32"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading} // Usar la prop loading
          >
            Obtener Predicción
          </Button>
        </div>
      </form>
      <PrimeReactToast message={alertMessage} />
    </>
  );
}
