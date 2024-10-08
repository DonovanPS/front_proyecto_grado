"use client";
import React, { useState, useRef, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import S3Service from "@/service/s3Service";
import DataService from "@/service/dataService";
import { FileUpload } from 'primereact/fileupload';
import TableComponent from "@/components/table";
import ComponentPredictionPraph from "@/components/prediction-praph";
import Grid from '@mui/material/Unstable_Grid2';

import { AutoComplete } from "primereact/autocomplete";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { ProgressBar } from 'primereact/progressbar';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { useFileContext } from "@/app/context/fileContex";

export default function Page() {
    const [folderPath, setFolderPath] = useState("");
    const toast = useRef(null);
    const [exist, setExist] = useState(false);
    const [showTableAndPredictions, setShowTableAndPredictions] = useState(false);

    const [summary, setSummary] = useState("");
    const [title, setTitle] = useState("");
    const [button, setButton] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);

    // Formulario para la predicción
    const [descriptions, setDescriptions] = useState(['EQUIPO ADMINISTRACION CON BOMBA FREEGO + BOLSA X 1500 ML']); // Valor predeterminado inicial
    const [periods, setPeriods] = useState(6);
    const [predictionData, setPredictionData] = useState([]);
    const [filteredDescriptions, setFilteredDescriptions] = useState([]);
    const [descriptionsList, setDescriptionsList] = useState([]);

    // progressBar
    const [loading, setLoading] = useState(false);

    // Contexto
    const { setFolder } = useFileContext(); // nombre de la carpeta desde el contexto
    const { checkFileName } = useFileContext(); // nombre del archivo desde el contexto
    const [fileName, setFileName] = useState(''); 

    useEffect(() => {
        if (checkFileName) {
            setFileName(checkFileName); 
        }
    }, [checkFileName]); 


    // ---------------------------------------------------

    const existFolder = async () => {
        clear();

        try {
            const response = await S3Service.validFolder(folderPath);

            if (response) {
                const { success, exists, message } = response;
                setExist(exists);

                if (toast.current) {
                    toast.current.clear();
                    toast.current.show({
                        severity: success ? (exists ? "success" : "warn") : "warn",
                        summary: success ? (exists ? "Existe" : "No existe") : "No existe",
                        detail: message || "La carpeta no existe",
                        life: 3000,
                    });
                }

                if (success) {
                    const summary = exists ? "Desea acceder a la carpeta?" : "Desea crear la carpeta?";
                    const title = exists ? "Carpeta existente" : "Carpeta no existente";
                    const button = exists ? "Acceder" : "Crear";
                    setSummary(summary);
                    setTitle(title);
                    setButton(button);

                    // Inicia el proceso para mostrar el toast de confirmación después del tiempo de vida del primer toast
                    setShowConfirm(true);
                }
            }
        } catch (error) {
            if (toast.current) {
                toast.current.clear();
                toast.current.show({
                    severity: "error",
                    summary: "Error al validar si existe",
                    detail: error.message,
                    life: 3000,
                });
            }
        }
    };

    useEffect(() => {
        if (showConfirm) {
            const timer = setTimeout(() => {
                confirm();
                setShowConfirm(false);
            }, 3000);

            return () => clearTimeout(timer); // Limpia el timer si el componente se desmonta o si cambia el estado
        }
    }, [showConfirm]);

    // Toast para mostrar el mensaje de confirmación
    const [visible, setVisible] = useState(false);
    const toastBC = useRef(null);

    const clear = () => {
        toastBC.current?.clear();
        setVisible(false);
    };

    const confirm = () => {
        if (!visible) {
            setVisible(true);
            toastBC.current?.clear();
            toastBC.current?.show({
                severity: 'success',
                summary: summary,
                sticky: true,
                content: (props) => (
                    <div className="flex flex-column align-items-left" style={{ flex: '1' }}>
                        <div className="flex align-items-center gap-2">
                            <span className="font-bold text-900">{title}</span>
                        </div>
                        <div className="font-medium text-lg my-3 text-800">{props.message.summary}</div>
                        <div className="flex justify-between w-full">
                            <Button className="p-button-sm w-full " label={button} severity="success" onClick={exist ? ShowTableAndPrediction : createFolder}></Button>
                            <Button className="p-button-sm w-full ml-2 p-button-danger" label="Cancelar" severity="error" onClick={clear}></Button>
                        </div>
                    </div>
                )
            });
        }
    };

    const ShowTableAndPrediction = () => {        
        setShowTableAndPredictions(true);
        setFolder(folderPath);

        clear();

    };

    const createFolder = async () => {
        try {
            const response = await S3Service.createFolder(folderPath);

            if (response) {
                const { success, message } = response;

                if (toast.current) {
                    toast.current.clear();
                    toast.current.show({
                        severity: success ? "success" : "warn",
                        summary: success ? "Carpeta creada" : "Error al crear la carpeta",
                        detail: message || "La carpeta no se pudo crear",
                        life: 3000,
                    });
                }
            }
        } catch (error) {
            if (toast.current) {
                toast.current.clear();
                toast.current.show({
                    severity: "error",
                    summary: "Error al crear la carpeta",
                    detail: error.message,
                    life: 3000,
                });
            }
        }
    };

    // Enviar hojas de cálculo al servicio
    const Upload = async (event) => {
        try {
            const files = event.files; // Obtiene los archivos seleccionados
            const response = await S3Service.uploadSpreadsheetFiles(files, folderPath);

            if (response.success) {
                toast.current.show({
                    severity: "success",
                    summary: "Archivos subidos",
                    detail: "Los archivos han sido subidos correctamente.",
                    life: 3000,
                });
            } else {
                toast.current.show({
                    severity: "error",
                    summary: "Error al subir archivos",
                    detail: response.message,
                    life: 3000,
                });
            }
        } catch (error) {
            console.error("Error al subir los archivos:", error);
            toast.current.show({
                severity: "error",
                summary: "Error al subir archivos",
                detail: "Ha ocurrido un error al subir los archivos.",
                life: 3000,
            });
        }
    };

    // Autocompletar para la descripción de la predicción
    useEffect(() => {
        S3Service.getDescriptions(folderPath, fileName).then((data) => {
            if (data && data.success) {
                setDescriptionsList(data.descriptions);
            }
        }).catch((error) => {
            console.error('Error al cargar las descripciones:', error);
        });
    }, [folderPath, fileName]);

    const searchDescription = (event) => {
        const query = event.query.toLowerCase();
        let suggestions = [];

        if (!query.trim().length) {
            suggestions = [...descriptionsList];
        } else {
            suggestions = descriptionsList.filter((desc) =>
                desc.toLowerCase().includes(query)
            );
        }

        setFilteredDescriptions(suggestions);
    };

    const handleDescriptionChange = (value, index) => {
        const newDescriptions = [...descriptions];
        newDescriptions[index] = value;
        setDescriptions(newDescriptions);
    };

    // Modificar la función para agregar el valor predeterminado
    const addDescriptionField = (valor) => {

        if (valor.medication) {
            const newDescriptions = [...descriptions, valor.medication];
            setDescriptions(newDescriptions);
        } else {
            const newDescriptions = [...descriptions, 'Valor predeterminado'];
            setDescriptions(newDescriptions);
        }
    };

    const removeDescriptionField = (index) => {
        if (descriptions.length > 1) {
            const newDescriptions = descriptions.filter((_, i) => i !== index);
            setDescriptions(newDescriptions);
        }
    };

    // Petición para predicción
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Inicia la carga
        try {

            if(fileName === ''){
                toast.current.show({
                    severity: "warn",
                    summary: "Archivo no seleccionado",
                    detail: "Por favor seleccione un archivo.",
                    life: 3000,
                });
                setLoading(false);
                return;
            }
            

            // crear un array de promesas
            const predictionsPromises = descriptions.map(async (description) => {
                // Ejecutar ambas peticiones en paralelo para cada descripción
                const [data, topCorrelated] = await Promise.all([
                    DataService.getPrediction(folderPath,fileName, description, periods),
                    DataService.getTopCorrelatedMedications(folderPath, fileName,description, 5),
                ]);
                return { description, data, topCorrelated };
            });

            // Esperar a que todas las promesas se resuelvan
            const predictions = await Promise.all(predictionsPromises);

            setPredictionData(predictions);
        } catch (error) {
            console.error('Error al obtener la predicción:', error);
        } finally {
            setLoading(false);
        }
    };


    const getOnlyPredictions = (data) => {
        if (data && Array.isArray(data.predictions) && Array.isArray(data.historical_data)) {
            const lastHistoricalValue = data.historical_data[data.historical_data.length - 1].y;

            const truncatedPredictions = data.predictions.slice(- (periods + 1));

            if (truncatedPredictions.length > 0) {
                truncatedPredictions[0].yhat = lastHistoricalValue;
            }

            return truncatedPredictions;
        }

        return [];
    };

    const [predictionCards, setPredictionCards] = useState([
        { id: Date.now(), descriptions: [''], periods: 6, predictionData: null }
    ]);

    const addNewPredictionCard = () => {
        setPredictionCards([
            ...predictionCards,
            { id: Date.now(), descriptions: [''], periods: 6, predictionData: null }
        ]);
    };

    return (
        <>
            <div className="card flex flex-column md:flex-row gap-5 max-w-xs w-full p-4">
                <Toast ref={toast} />
                <div className="p-inputgroup flex-1">
                    <InputText
                        placeholder="Folder Path"
                        value={folderPath}
                        onChange={(e) => setFolderPath(e.target.value)}
                    />
                    <Button
                        icon="pi pi-search"
                        className="p-button-warning"
                        onClick={existFolder}
                    />
                </div>
            </div>

            <div className="card">
                <FileUpload
                    name="demo[]"
                    customUpload
                    uploadHandler={Upload}
                    multiple
                    accept=".xls,.xlsx,.csv"
                    emptyTemplate={<p className="m-0 text-sm">Arrastra y suelta los archivos aquí para subirlos.</p>}
                    className="p-2"
                    chooseOptions={{ className: 'p-button-sm py-2 px-3 text-sm' }}
                    uploadOptions={{ className: 'p-button-sm py-2 px-3 text-sm' }}
                    cancelOptions={{ className: 'p-button-sm py-2 px-3 text-sm' }}
                />
            </div>

            <Toast ref={toastBC} position="bottom-center" onRemove={clear} />

            <TableComponent />

            <div className="card">
                <h2 className="card-title">Título del Componente</h2>
                <Grid xs={12} md={6} lg={8}>
                    <ComponentPredictionPraph
                        title="Website Visits"
                        subheader="(+43%) than last year"
                        chart={{
                            labels: [
                                '01/01/2003',
                                '02/01/2003',
                                '03/01/2003',
                                '04/01/2003',
                                '05/01/2003',
                                '06/01/2003',
                                '07/01/2003',
                                '08/01/2003',
                                '09/01/2003',
                                '10/01/2003',
                                '11/01/2003',
                            ],
                            series: [
                                {
                                    name: 'Team A',
                                    type: 'column',
                                    fill: 'solid',
                                    data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                                },
                                {
                                    name: 'Team B',
                                    type: 'area',
                                    fill: 'gradient',
                                    data: [46.49401232535094, 68.09160362430347, 83.59367773080442, 39.97422319809, 22, 43, 21, 41, 56, 27, 43],
                                },
                                {
                                    name: 'Team C',
                                    type: 'line',
                                    fill: 'solid',
                                    data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                                },
                            ],
                        }}
                    />
                </Grid>
            </div>

            <div className="card predicciones relative">
                <h2 className="card-title">Predicciones</h2>

                <Button
                    icon="pi pi-plus"
                    className="absolute top-2 right-2"
                    rounded text severity="success"
                    aria-label="Agregar Predicción"
                    onClick={addNewPredictionCard}
                />

                <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
                    <div className="flex flex-col space-y-2">
                        {descriptions.map((description, index) => (
                            <div key={index} className="flex items-center space-x-2">
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
                                    <Button icon="pi pi-plus" rounded text severity="success" aria-label="+" onClick={addDescriptionField} />
                                )}
                                {descriptions.length > 1 && (
                                    <Button icon="pi pi-times" rounded text severity="danger" aria-label="-" type="button" onClick={() => removeDescriptionField(index)} />
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
                        <Button type="submit" variant="contained" color="primary" disabled={loading}>
                            Obtener Predicción
                        </Button>
                    </div>
                </form>

                {/* Mostrar ProgressBar mientras se carga */}
                {loading && (
                    <div className="mt-4">
                        <ProgressBar mode="indeterminate" style={{ height: '6px' }}></ProgressBar>
                    </div>
                )}

                {/* Renderizar datos de predicción si existen y no está cargando */}
                {!loading && predictionData.length > 0 && (() => {
                    const dataExample = predictionData[0].data;
                    const labels = [
                        ...dataExample.historical_data.map((item) => item.ds),
                        ...getOnlyPredictions(dataExample).slice(1).map((item) => item.ds),
                    ];

                    const series = [];

                    // Crear series para cada descripción
                    predictionData.forEach(({ description, data }) => {
                        const historicalValues = data.historical_data.map((item) => item.y);

                        const predictions = getOnlyPredictions(data);
                        const predictionValues = predictions.map((item) => item.yhat);

                        console.log(data);
                        console.log(predictions);
                        
                        
                        const historicalSeriesData = [
                            ...historicalValues,
                            ...Array(predictionValues.length - 1).fill(null),
                        ];

                        const predictionSeriesData = [
                            ...Array(historicalValues.length - 1).fill(null),
                            ...predictionValues,
                        ];

                        series.push({
                            name: `${description} - Histórico`,
                            type: 'line',
                            fill: 'solid',
                            data: historicalSeriesData,
                        });

                        series.push({
                            name: `${description} - Predicción`,
                            type: 'line',
                            fill: 'dashed',
                            data: predictionSeriesData,
                        });
                    });

                    return (
                        <>
                            <Grid xs={12} md={6} lg={8} className="mt-4">
                                <ComponentPredictionPraph
                                    title="Comparación de Predicciones"
                                    subheader="Comparativa entre descripciones"
                                    chart={{
                                        labels: labels,
                                        series: series,
                                    }}
                                />
                            </Grid>

                            {/* Renderizar el Accordion */}
                            <div className="mt-4">
                                <Accordion multiple activeIndex={[0]}>
                                    {predictionData.map(({ description, topCorrelated }, index) => (
                                        <AccordionTab key={index} header={
                                            <>
                                                Top correlaciones para{' '}
                                                <code
                                                    style={{
                                                        backgroundColor: '#424242',
                                                        padding: '.15rem .3rem',
                                                        borderRadius: '.25rem',
                                                        fontFamily: 'monospace',
                                                        fontSize: '1em',
                                                    }}
                                                >
                                                    {description}
                                                </code>
                                            </>
                                        }>



                                            <DataTable
                                                className="text-sm"
                                                value={topCorrelated.top_correlated_medications}
                                                size="small"
                                                tableStyle={{ minWidth: '50rem' }}
                                            >
                                                <Column field="medication" header="Descripción"
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
                                                            onClick={() => addDescriptionField(rowData)}
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
                })()}
            </div>
        </>
    );
}
