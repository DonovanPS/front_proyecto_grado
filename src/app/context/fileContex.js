"use client"

import React, { createContext, useState, useContext } from 'react';


const FileContext = createContext();

// Proveedor del contexto
export const FileProvider = ({ children }) => {
    const [checkFileName, setCheckFileName] = useState('');
    const [folder, setFolder] = useState(''); 
    const [update, setUpdate] = useState(false);
    const [groupedData, setGroupedData] = useState({});

    return (
        <FileContext.Provider value={{ checkFileName, setCheckFileName, folder, setFolder, update, setUpdate, groupedData, setGroupedData }}>
            {children}
        </FileContext.Provider>
    );
};

// Hook para usar el contexto
export const useFileContext = () => useContext(FileContext);
