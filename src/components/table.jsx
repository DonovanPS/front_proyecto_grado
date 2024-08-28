"use client";

import React, { useState, useEffect } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import S3Service from '@/service/s3Service';
import * as XLSX from 'xlsx';

export default function TableComponent() {
    const [data, setData] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [visible, setVisible] = useState(false);
    const [spreadsheetData, setSpreadsheetData] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState(''); // Nuevo estado para el nombre del archivo

    useEffect(() => {
        S3Service.getFilesInFolder("demo").then((data) => {
            setData(data.files);
            setLoading(false);
        });
    }, []);

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const viewSpreadsheet = (fileUrl, fileName) => {
        fetch(fileUrl)
            .then((response) => response.arrayBuffer())
            .then((data) => {
                const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                setSpreadsheetData(jsonData);
                setSelectedFileName(fileName); // Guardar el nombre del archivo
                setVisible(true);
            })
            .catch((error) => {
                console.error("Error al cargar el archivo:", error);
            });
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </IconField>
            </div>
        );
    };

    const viewButtonTemplate = (rowData) => {
        return (
            <Button
                label="Ver"
                icon="pi pi-eye"
                onClick={() => viewSpreadsheet(rowData.Url, rowData.Name)} // Pasar la URL y el nombre del archivo
            />
        );
    };

    const header = renderHeader();

    return (
        <div className="card">
            <DataTable value={data} paginator rows={10} dataKey="Key" filters={filters} loading={loading}
                globalFilterFields={['Name', 'Size', 'status']} header={header} emptyMessage="No hay archivos encontrados.">
                <Column field="LastModified" header="Fecha" style={{ minWidth: '12rem' }} />
                <Column field="Name" header="Name" style={{ minWidth: '12rem' }} />
                <Column header="Tamaño" field="Size" style={{ minWidth: '12rem' }} />
                <Column body={viewButtonTemplate} header="Acciones" style={{ minWidth: '8rem' }} />
            </DataTable>

            <Dialog header={`Previsualización de ${selectedFileName}`} visible={visible} maximizable style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                {spreadsheetData ? (
                    <table className="p-datatable p-component">
                        <thead>
                            <tr>
                                {Object.keys(spreadsheetData[0]).map((key) => (
                                    <th key={key}>{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {spreadsheetData.map((row, index) => (
                                <tr key={index}>
                                    {Object.values(row).map((value, idx) => (
                                        <td key={idx}>{value}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Cargando datos...</p>
                )}
            </Dialog>
        </div>
    );
}
