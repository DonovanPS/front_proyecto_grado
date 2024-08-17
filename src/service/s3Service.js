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

}

export default S3Service;
