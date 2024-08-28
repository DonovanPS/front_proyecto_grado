const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const DataService = {

    
    getPrediction: async (folder_name, description,periods) => {
        try {
            const response = await fetch(`${apiUrl}/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ folder_name, description,periods }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error in DataService.getPrediction:', error);
            throw error;
        }
    }

}

export default DataService;