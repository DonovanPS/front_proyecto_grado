import React, { useState, useRef, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import PrimeReactToast from '@/components/Toast'; 
import S3Service from '@/service/s3Service';
import { useFileContext } from '@/app/context/fileContex';
import { Toast } from 'primereact/toast';

export default function FolderSelector({ setShowTableAndPredictions }) {
    const [folderPath, setFolderPath] = useState("");
    const [exist, setExist] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null); 
    const [summary, setSummary] = useState("");
    const [title, setTitle] = useState("");
    const [button, setButton] = useState("");
    const [showConfirm, setShowConfirm] = useState(false); 
    const toastBC = useRef(null); 
    const { setFolder } = useFileContext(); 

    const clear = () => {
        toastBC.current?.clear();
    };

    const confirm = () => {
        if (toastBC.current) {
            toastBC.current.clear();
            toastBC.current.show({
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
                            <Button
                                className="p-button-sm w-full"
                                label={button}
                                severity="success"
                                onClick={exist ? handleAccessFolder : handleCreateFolder}
                            />
                            <Button
                                className="p-button-sm w-full ml-2 p-button-danger"
                                label="Cancelar"
                                severity="error"
                                onClick={clear}
                            />
                        </div>
                    </div>
                )
            });
        }
    };

    const existFolder = async () => {
        clear(); 
        try {
            const response = await S3Service.validFolder(folderPath);
            if (response) {
                const { success, exists, message } = response;
                setExist(exists);

              
                setAlertMessage({
                    severity: success ? (exists ? "success" : "warn") : "warn",
                    summary: success ? (exists ? "Existe" : "No existe") : "No existe",
                    content: message || "La carpeta no existe",
                    time: 2000,
                });

                if (success) {
             
                    const summaryText = exists ? "¿Desea acceder a la carpeta?" : "¿Desea crear la carpeta?";
                    const titleText = exists ? "Carpeta existente" : "Carpeta no existente";
                    const buttonText = exists ? "Acceder" : "Crear";

                    setSummary(summaryText);
                    setTitle(titleText);
                    setButton(buttonText);


                    setShowConfirm(true);
                }
            }
        } catch (error) {
            setAlertMessage({
                severity: "error",
                summary: "Error al validar",
                content: error.message,
                time: 3000,
            });
        }
    };

    useEffect(() => {
        if (showConfirm) {
            const timer = setTimeout(() => {
                confirm(); 
                setShowConfirm(false);
            }, 3000);

            return () => clearTimeout(timer); 
        }
    }, [showConfirm]);

    const handleAccessFolder = () => {
        setFolder(folderPath);
        setShowTableAndPredictions(true);
        clear(); 
    };

    const handleCreateFolder = () => {
        // Lógica para crear la carpeta en S3
        S3Service.createFolder(folderPath)
            .then(() => {
                setAlertMessage({
                    severity: "success",
                    summary: "Carpeta creada",
                    content: `Se ha creado la carpeta: ${folderPath}`,
                    time: 3000,
                });
                setFolder(folderPath);
                setShowTableAndPredictions(true);
            })
            .catch(error => {
                setAlertMessage({
                    severity: "error",
                    summary: "Error al crear la carpeta",
                    content: error.message,
                    time: 3000,
                });
            });
        clear(); // Limpiar el toast de confirmación
    };

    return (
        <div className="card flex flex-column md:flex-row gap-5 max-w-xs w-full p-4">
            <PrimeReactToast message={alertMessage} /> 
            <Toast ref={toastBC} position="bottom-center" /> 
            <div className="p-inputgroup flex-1">
                <InputText
                    placeholder="Folder Path"
                    value={folderPath}
                    onChange={(e) => setFolderPath(e.target.value)}
                />
                <Button icon="pi pi-search" className="p-button-warning" onClick={existFolder} />
            </div>
        </div>
    );
}
