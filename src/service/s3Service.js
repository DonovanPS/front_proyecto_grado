const S3Service = {
    validFolder: async (folderPath) => {
        try {
            const response = await fetch('/api/s3/folder/check_folder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ folderPath }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error in S3Service.validFolder:', error);
            throw error; // Lanza el error para que pueda ser capturado en la llamada a validFolder
        }
    },

    createFolder: async (folderPath) => {
        try {
            const response = await fetch('/api/s3/folder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ folderPath }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error in S3Service.createFolder:', error);
            throw error; // Lanza el error para que pueda ser capturado en la llamada a createFolder
        }
    },

    uploadSpreadsheetFiles: async (files, folderPath) => {
        try {
            const formData = new FormData();

            // Añadir cada archivo a formData
            files.forEach(file => {
                formData.append('files', file);
                formData.append('folder', folderPath);
            });

            const response = await fetch('/api/s3/upload', {
                method: 'POST',
                body: formData, // No se necesita 'Content-Type', Fetch API lo maneja automáticamente
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error in S3Service.uploadSpreadsheetFiles:', error);
            throw error;
        }
    },

    getFilesInFolder: async(folderPath)=>{
        try{
            const response = await fetch(`/api/s3/get_files?folderPath=${folderPath}`);
            if(!response.ok){
                throw new Error(response.message);
            }
            const data = await response.json();
            return data;
        }catch (error) {
            console.error('Error en S3Service.getFilesInFolder:', error);
            throw error;
        }
    },

    getDescriptions: async(folderPath, fileName)=>{
        try{
            const response = await fetch(`/api/s3/get_description?folderPath=${folderPath}&fileName=${fileName}`);
            if(!response.ok){
                throw new Error(response.message);
            }
            const data = await response.json();
            return data;
        }catch (error) {
            console.error('Error en S3Service.getDescriptions:', error);
            throw error;
        }

    },
}

export default S3Service;
