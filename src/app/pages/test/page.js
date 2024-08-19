"use client";
import React, { useState, useRef, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import S3Service from "@/service/s3Service";
import { FileUpload } from 'primereact/fileupload';

export default function ButtonDemo() {
    const [folderPath, setFolderPath] = useState("");
    const toast = useRef(null);
    const [exist, setExist] = useState(false);


    const [summary, setSummary] = useState("");
    const [title, setTitle] = useState("");
    const [button, setButton] = useState("");
    const [showConfirm, setShowConfirm] = useState(false); 

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
                setShowConfirm(false); // Reinicia el estado
            }, 3000);

            return () => clearTimeout(timer); // Limpia el timer si el componente se desmonta o si cambia el estado
        }
    }, [showConfirm]);

    // Toast para mostrar el mensaje de confirmación
    const [visible, setVisible] = useState(false);
    const toastBC = useRef(null);

    const clear = () => {
        toastBC.current.clear();
        setVisible(false);
    };

    const confirm = () => {
        if (!visible) {
            setVisible(true);
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
                            <Button className="p-button-sm w-full " label={button} severity="success" onClick={exist ? () => {} : createFolder}></Button>
                            <Button className="p-button-sm w-full ml-2 p-button-danger" label="Cancelar" severity="error" onClick={clear}></Button>
                        </div>

                    </div>
                )
            });
        }
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
    }

    // Enviar hojas de calculo al servicio
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


        </>
    );
}
