// components/FileUploader.jsx
import React, { useEffect, useRef, useState } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import S3Service from '@/service/s3Service';
import { useFileContext } from '@/app/context/fileContex';


export default function FileUploader() {
    const { folder, update ,setUpdate } = useFileContext(); 

    const [folderPath, setFolderPath] = useState('');
    const toast = useRef(null);

    useEffect(() => {
        setFolderPath(folder);
    }, [folder]);

    const Upload = async (event) => {
        try {
            const files = event.files;
            const response = await S3Service.uploadSpreadsheetFiles(files, folderPath);

            if (response.success) {
                toast.current.show({
                    severity: "success",
                    summary: "Archivos subidos",
                    detail: "Los archivos han sido subidos correctamente.",
                    life: 3000,
                });

                setUpdate(prevUpdate => !prevUpdate);
            } else {
                toast.current.show({
                    severity: "error",
                    summary: "Error al subir archivos",
                    detail: response.message,
                    life: 3000,
                });
            }

        } catch (error) {
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
            <Toast ref={toast} />
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
        </>
    );
}
