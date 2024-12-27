const apiUrl_prophet = process.env.NEXT_PUBLIC_API_URL_prophet;
const apiUrl_xgboost = process.env.NEXT_PUBLIC_API_URL_xgboost;
const apiUrl_sarimax = process.env.NEXT_PUBLIC_API_URL_sarimax;

const apiUrls = {
    prophet: process.env.NEXT_PUBLIC_API_URL_prophet,
    xgboost: process.env.NEXT_PUBLIC_API_URL_xgboost,
    sarimax: process.env.NEXT_PUBLIC_API_URL_sarimax,
};


const DataService = {


    getPrediction: async (folder_name, file_name, description, periods, model) => {

        const apiUrl = apiUrls[model];    
        try {
            const response = await fetch(`${apiUrl}/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ folder_name, file_name, description, periods }),
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
    },

    getTopCorrelatedMedications: async (folder_name, file_name, description, top_n, model) => {
        const apiUrl = apiUrls[model]; 

        try {
            const response = await fetch(`${apiUrl}/top_correlated`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ folder_name, file_name, description, top_n }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error in DataService.getTopCorrelatedMedications:', error);
            throw error;
        }
    },
};



export default DataService;